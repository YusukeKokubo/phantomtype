import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
admin.initializeApp()

import * as path from 'path'
import * as crypto from 'crypto'
import * as os from 'os'
import * as fs from 'fs'
import * as Storage from '@google-cloud/storage'
import { convertToLocalTime } from 'date-fns-timezone'
import sharp, { Metadata } from 'sharp'
const exifreader = require('exif-reader')
import Fraction from 'fraction.js'

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

  if (object.contentType?.startsWith('image/webp')) {
    console.error('This is a webp.')
    return null
  }

  if (filePath.includes('-comp.jpeg')) {
    console.error('This is a compressed image.')
    return null
  }

  const storage = new Storage.Storage()
  const bucket = storage.bucket(object.bucket)
  await bucket.file(filePath).download({ destination: tempLocalFile });

  // Make download url
  const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o`
  const url = `${baseUrl}/${encodeURIComponent(filePath)}?alt=media`;

  // Get Exif
  const { exif, meta } = await sharp(tempLocalFile)
    .metadata()
    .then((m: Metadata) => {
      const ex = exifreader(m.exif)
      ex.exif.DateTimeOriginal = convertToLocalTime(ex.exif.DateTimeOriginal, { timeZone: 'Asia/Tokyo' })
      ex.exif.DateTimeDigitized = convertToLocalTime(ex.exif.DateTimeDigitized, { timeZone: 'Asia/Tokyo' })
      ex.image.ModifyDate = convertToLocalTime(ex.image.ModifyDate, { timeZone: 'Asia/Tokyo' })
      ex.exif.ExposureTime = new Fraction(ex.exif.ExposureTime).toFraction()
      ex.exif.ApertureValue = new Fraction(ex.exif.ApertureValue).toFraction()
      ex.exif.ShutterSpeedValue = new Fraction(ex.exif.ShutterSpeedValue).toFraction()
      console.log('width: ', m.width)
      console.log('height: ', m.height)
      return { exif: ex, meta: m }
    })

  // Webp
  const tempLocalWebpFile = path.join(os.tmpdir(), "webp" + randomFileName)
  const webpFilePath = path.join(city, path.basename(filename, path.extname(filename)) + '.webp')
  await sharp(tempLocalFile).webp({ quality: 50 }).toFile(tempLocalWebpFile)
  await bucket.upload(tempLocalWebpFile, { destination: webpFilePath, metadata: { contentType: 'image/webp' }, public: true })
  fs.unlinkSync(tempLocalWebpFile)
  const webpUrl = `${baseUrl}/${encodeURIComponent(webpFilePath)}?alt=media`
  console.log("webp: ", webpFilePath)

  // Compress
  const tempLocalCompFile = path.join(os.tmpdir(), "comp" + randomFileName)
  const compFilePath = path.join(city, path.basename(filename, path.extname(filename)) + '-comp.jpeg')
  await sharp(tempLocalFile).jpeg({ quality: 50 }).toFile(tempLocalCompFile)
  await bucket.upload(tempLocalCompFile, { destination: compFilePath, metadata: { contentType: 'image/jpeg' }, public: true })
  fs.unlinkSync(tempLocalCompFile)
  const compUrl = `${baseUrl}/${encodeURIComponent(compFilePath)}?alt=media`
  console.log("jpeg: ", compFilePath)

  // Save Exif
  const metadata = {
    ...exif,
    filePath: filePath,
    filename: filename,
    url: url,
    webp: webpUrl,
    compressed: compUrl,
    city: city
  }

  await admin.firestore().collection('pics').doc(`${city}-${filename}`).set(metadata);
  console.log('Wrote to:', filePath);
  fs.unlinkSync(tempLocalFile)

  console.log(`finished!`)
  return null
});

exports.deleteExif = functions.region('asia-northeast1').storage.object().onDelete(async (object) => {
  const filePath = object.name;
  await admin.firestore().collection('pics').where('filePath', '==', filePath)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete().then(() => {
          console.log(`Deleted: ${filePath}: ${doc.ref.id}`)
        })
          .catch((error) => console.error(error))
      })
    })
    .catch((error) => console.error(error))
})
