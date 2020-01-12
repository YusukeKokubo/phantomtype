import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
admin.initializeApp()

import * as path from 'path'
import * as crypto from 'crypto'
import * as os from 'os'
import * as fs from 'fs'
import * as Storage from '@google-cloud/storage'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ 
  dev: false, 
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` } 
})
const handle = app.getRequestHandler()

export const nextApp = functions.region('asia-northeast1').https.onRequest((req, res) => {
  console.log('File: ' + req.originalUrl)
  return app.prepare().then(() => handle(req, res))
})

export const createExif = functions.region('asia-northeast1').storage.object().onFinalize(async (object) => {
    const filePath = object.name!

    const [city, filename] = filePath.split('/')
    console.log(city)
    console.log(filename)
    const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath)
    const tempLocalFile = path.join(os.tmpdir(), randomFileName)

    if (!object.contentType?.startsWith('image/')) {
        console.error('This is not an image.')
        return null
    }

    const storage = new Storage.Storage()
    const bucket = storage.bucket(object.bucket)
    await bucket.file(filePath).download({destination: tempLocalFile});

    // Get Exif
    const spawn = require("child-process-promise").spawn;
    const result = await spawn('identify', ['-verbose', '-format', '%[EXIF:*]', tempLocalFile], {capture: ['stdout', 'stderr']});
    console.log(result.stdout)
    const exif = toJsonAsString(result.stdout)
    console.debug(exif)

    // Save Exif
    const metadata = JSON.parse(`{
      "filePath": "${filePath}",
      "filename": "${filename}",
      "city": "${city}",
      "exif": ${exif}
    }`)
    await admin.firestore().collection('pics').add(metadata);
    console.log('Wrote to:', filePath, 'data:', metadata);
    fs.unlinkSync(tempLocalFile)

    console.log(`finished!`)
    return null
});

exports.deleteExif = functions.region('asia-northeast1').storage.object().onDelete(async (object) => {
    const filePath = object.name;
    await admin.firestore().collection('pics').where('filePath', '==', filePath)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete().then(() => {
              console.log(`Deleted: ${filePath}: ${doc.ref.id}`)
          })
          .catch((error) => console.error(error))
        })
      })
      .catch((error) => console.error(error))
  })

function toJsonAsString(src: string) {
  const lines = src.match(/[^\r\n]+/g)!;
  const jsonString = `{
      ${lines.map((line) => {
          const trimed = line.split('exif:')[1] // remove 'exif:'
          const v = trimed.split('=')
          return `"${v[0]}": "${v[1]}"\n`
      })}
  }`
  console.debug(jsonString)
  return jsonString
}
