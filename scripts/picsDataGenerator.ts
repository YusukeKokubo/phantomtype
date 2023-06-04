// public/pics配下から画像の一覧を取得して、public/pics.jsonを生成する
// 画像の一覧は、public/pics配下のディレクトリ名とファイル名を元に生成する
// 例: public/pics/kyoto/kyoto1.jpg -> public/pics.json -> ["kyoto/kyoto1.jpg"]
// 例: public/pics/kyoto/kyoto2.jpg -> public/pics.json -> ["kyoto/kyoto1.jpg", "kyoto/kyoto2.jpg"]
// 画像を読み込んだときにexifを解析してメタ情報としてjsonを生成する

const fs = require("fs")
const path = require("path")

import { Exif, Photo } from "../@types/Photo"
import * as ExifReader from "exifreader"

function picsDataGenerator() {
  const dirPath = path.join(__dirname, "../public/pics")
  const cityDirs = fs.readdirSync(dirPath)
  const result = cityDirs.map((cityName) => {
    const cityDirPath = path.join(dirPath, cityName)
    const cityLocationDirs = readDir(cityDirPath)
    const cityPics = cityLocationDirs.map((cityLocationName) => {
      const cityLocationDirPath = path.join(cityDirPath, cityLocationName)
      const picsDir = fs.readdirSync(cityLocationDirPath)
      console.log(picsDir)

      const pics = picsDir
        .filter((file) => file.toLowerCase().endsWith(".jpg"))
        .map((filePath) => {
          const exif = readExif(`${cityLocationDirPath}/${filePath}`)
          const pic: Photo = {
            filename: filePath,
            city: cityName,
            location: cityLocationName,
            url: `/pics/${cityName}/${filePath}`,
            exif: exif,
          }
          console.log(pic)
          return pic
        })
      return { location: cityLocationName, pics: pics }
    })
    return { city: cityName, locations: cityPics }
  })
  const json = JSON.stringify(result)
  fs.writeFileSync(path.join(__dirname, "../public/pics.json"), json)
}

const readDir = (dirPath: string) => {
  const dirs = fs.readdirSync(dirPath, { withFileTypes: true })
  return dirs.filter((d) => d.isDirectory()).map((d) => d.name)
}

const readExif = (filePath: string): Exif | null => {
  const p = fs.readFileSync(`${filePath}`)
  console.log(filePath)
  const tags = ExifReader.load(p, { expanded: true })
  const exif = tags.exif!
  const tFile = tags.file!
  if (!exif || !tFile) {
    console.error("Image has not exif.")
    return null
  }
  const dateTimeOriginal = exif.DateTimeOriginal?.description
  const make = exif.Make?.description
  const model = exif.Model?.description
  const lensMake = exif["LensMake"]?.description || ""
  const lensModel = exif["LensModel"]?.description || ""
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
    FocalLengthIn35mmFormat: focalLengthIn35mm || "",
    FNumber: fnumber || "",
    ExposureTime: exposureTime || "",
    ISO: iso || "",
  }
}

picsDataGenerator()
