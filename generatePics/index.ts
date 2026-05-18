// src/assets/pics配下から画像の一覧を取得して、public/pics.jsonを生成する
// 画像の一覧は、src/assets/pics配下のディレクトリ名とファイル名を元に生成する
// 例: src/assets/pics/kyoto/kyoto1.jpg -> public/pics.json -> url: "/src/assets/pics/kyoto/..."
// 画像を読み込んだときにexifを解析してメタ情報としてjsonを生成する

const fs = require("node:fs")
const path = require("node:path")

import * as ExifReader from "exifreader"
import sharp from "sharp"
import type { Exif, Photo } from "../@types/Photo"

async function generateLqip(filePath: string): Promise<string | undefined> {
  try {
    const buffer = await sharp(filePath)
      .resize(20, undefined, { withoutEnlargement: true })
      .blur(2)
      .webp({ quality: 20 })
      .toBuffer()
    return `data:image/webp;base64,${buffer.toString("base64")}`
  } catch (error) {
    console.error(`LQIP failed for ${filePath}:`, error)
    return undefined
  }
}

async function picsDataGenerator() {
  const dirPath = path.join(__dirname, "../src/assets/pics")
  const cityDirs = fs.readdirSync(dirPath)
  const cities = cityDirs.filter((d: string) =>
    fs.statSync(path.join(dirPath, d)).isDirectory(),
  )
  const result = await Promise.all(
    cities.map(async (cityName: string) => {
      const cityDirPath = path.join(dirPath, cityName)
      const cityLocationDirs = readDir(cityDirPath)
      const cityPics = await Promise.all(
        cityLocationDirs.map(async (cityLocationName: string) => {
          const cityLocationDirPath = path.join(cityDirPath, cityLocationName)
          const picsDir = fs.readdirSync(cityLocationDirPath)
          console.log(picsDir)

          const pics = await Promise.all(
            picsDir
              .filter((file: string) => /\.(jpe?g)$/i.test(file))
              .map(async (filePath: string) => {
                const absolutePath = `${cityLocationDirPath}/${filePath}`
                const [exif, lqip] = await Promise.all([
                  Promise.resolve(readExif(absolutePath)),
                  generateLqip(absolutePath),
                ])
                const pic: Photo = {
                  filename: filePath,
                  city: cityName,
                  location: cityLocationName,
                  url: `/src/assets/pics/${cityName}/${cityLocationName}/${filePath}`,
                  exif: exif,
                  ...(lqip ? { lqip } : {}),
                }
                console.log(pic.filename, lqip ? "lqip ok" : "no lqip")
                return pic
              }),
          )
          return { location: cityLocationName, pics: pics }
        }),
      )
      return { city: cityName, locations: cityPics }
    }),
  )
  const json = JSON.stringify(result)
  fs.writeFileSync(path.join(__dirname, "../public/pics.json"), json)
}

const readDir = (dirPath: string) => {
  const dirs = fs.readdirSync(dirPath, { withFileTypes: true })
  return dirs
    .filter((d: { isDirectory: () => boolean }) => d.isDirectory())
    .map((d: { name: string }) => d.name)
}

const readExif = (filePath: string): Exif | null => {
  try {
    const p = fs.readFileSync(filePath)
    console.log(filePath)
    const tags = ExifReader.load(p, { expanded: true })
    const exif = tags.exif!
    const tFile = tags.file!
    if (!exif || !tFile) {
      console.error("The image has not exif.")
      return null
    }
    const dateTimeOriginal = exif.DateTimeOriginal?.description
    const make = exif.Make?.description
    const model = exif.Model?.description
    const lensMake = exif.LensMake?.description || ""
    const lensModel = exif.LensModel?.description || ""
    const focalLength = exif.FocalLength?.description
    const focalLengthIn35mm = exif.FocalLengthIn35mmFilm?.description
    const fnumber = exif.FNumber?.description
    const exposureTime = exif.ExposureTime?.description
    const iso = exif.ISOSpeedRatings?.description
    return {
      ImageWidth: tFile["Image Width"]?.value!,
      ImageLength: tFile["Image Height"]?.value!,
      Make: make || "",
      Model: model || "",
      DateTimeOriginal: dateTimeOriginal || "",
      LensMake: lensMake,
      LensModel: lensModel,
      FocalLength: focalLength || "",
      FocalLengthIn35mmFormat: Number.parseInt(focalLengthIn35mm || "0", 10),
      FNumber: fnumber || "",
      ExposureTime: exposureTime || "",
      ISO: Number.parseInt(iso || "0", 10),
    }
  } catch (error) {
    console.error(`Error reading exif from ${filePath}:`, error)
    return null
  }
}

picsDataGenerator()
