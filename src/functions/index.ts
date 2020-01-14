import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
admin.initializeApp()

import * as path from 'path'
import * as crypto from 'crypto'
import * as os from 'os'
import * as fs from 'fs'
import * as Storage from '@google-cloud/storage'
import parse from 'date-fns/parse'
import { parseFromTimeZone, formatToTimeZone, convertToLocalTime } from 'date-fns-timezone'
import ja from 'date-fns/locale/ja'
import { firebaseConfig } from 'firebase-functions';
// import next from 'next'
import sharp from 'sharp'
const exifreader = require('exif-reader')
import Fraction from 'fraction.js'

// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ 
//   dev: false, 
//   conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` } 
// })
// const handle = app.getRequestHandler()

// export const nextApp = functions.region('asia-northeast1').https.onRequest((req, res) => {
//   console.log('File: ' + req.originalUrl)
//   return app.prepare().then(() => handle(req, res))
// })

export const createExif = functions.region('asia-northeast1').storage.object().onFinalize(async (object) => {
    const filePath = object.name!

    const [city, filename] = filePath.split('/')
    console.debug(`${city}: ${filename}`)
    const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath)
    const tempLocalFile = path.join(os.tmpdir(), randomFileName)

    if (!object.contentType?.startsWith('image/')) {
        console.error('This is not an image.')
        return null
    }

    const storage = new Storage.Storage()
    const bucket = storage.bucket(object.bucket)
    await bucket.file(filePath).download({destination: tempLocalFile});

    // Make download url
    const url = `https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o/${encodeURIComponent(filePath)}?alt=media`;
    console.debug(url)

    const exif = await sharp(tempLocalFile)
      .metadata()
      .then((metadata) => {
        const ex = exifreader(metadata.exif)
        ex.exif.DateTimeOriginal = convertToLocalTime(ex.exif.DateTimeOriginal, {timeZone: 'Asia/Tokyo'})
        ex.exif.DateTimeDigitized = convertToLocalTime(ex.exif.DateTimeDigitized, {timeZone: 'Asia/Tokyo'})
        ex.image.ModifyDate = convertToLocalTime(ex.image.ModifyDate, {timeZone: 'Asia/Tokyo'})
        ex.exif.ExposureTime = new Fraction(ex.exif.ExposureTime).toFraction()
        ex.exif.ApertureValue = new Fraction(ex.exif.ApertureValue).toFraction()
        ex.exif.ShutterSpeedValue = new Fraction(ex.exif.ShutterSpeedValue).toFraction()
        console.log("***********: " + typeof(new Fraction(ex.exif.ShutterSpeedValue).toFraction()))
        return ex
      })
    console.debug(exif)

    // Get Exif
    // const spawn = require("child-process-promise").spawn;
    // const result = await spawn('identify', ['-verbose', '-format', '%[EXIF:*]', tempLocalFile], {capture: ['stdout', 'stderr']});
    // console.debug(result.stdout)
    // const exif = exifAsObject(result.stdout)

    // Save Exif
    const metadata = {
      ...exif,
      filePath: filePath,
      filename: filename,
      url: url,
      city: city
    }
    console.debug({metadata: metadata})
 
    await admin.firestore().collection('pics').doc(`${city}-${filename}`).set(metadata);
    console.log('Wrote to:', filePath, 'data:', {metadata});
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

function exifAsObject(src: string) {
  const exif: any = {}
  const lines = src.match(/[^\r\n]+/g)!;
  console.log(lines)
  lines.forEach((line) => {
    const trimed = line.split('exif:')[1] // remove 'exif:'
    const [key, value] = trimed.split('=')
    const formatedValue = 
      DateKeys.includes(key) ? 
        admin.firestore.Timestamp.fromDate(
          parse(value, 'yyyy:MM:dd HH:mm:ss', new Date(), {locale: ja})): 
      value
    exif[key] = formatedValue
  })
  console.debug({exif: exif})
  return exif
}
const DateKeys = ['DateTime', 'DateTimeDigitized', 'DateTimeOriginal']
