import { NextPage } from "next"
import Image from "next/image"

import { Exif, Photo } from "../../@types/Photo"

import fs from "fs"
import React from "react"
import { FixedNav, Nav } from "../components/Nav"
import * as ExifReader from "exifreader"
import Head from "next/head"

type PicsInLoc = {
  location: string
  pics: Photo[]
}

function byDatetime(a: Photo, b: Photo): number {
  return b.exif!.DateTimeOriginal < a.exif!.DateTimeOriginal ? 1 : -1
}

function calcSize(
  exif: Exif,
  length: number
): { width: number; height: number } {
  const width = exif.ImageWidth
  const height = exif.ImageLength
  const align = width > height ? "horizon" : "vertical"

  if (align == "horizon") {
    const new_w = length
    const new_h = (height * new_w) / width
    return { width: new_w, height: new_h }
  } else {
    const new_h = length
    const new_w = (width * new_h) / height
    return { width: new_w, height: new_h }
  }
}

function Pic(params: { city: string; pic: Photo }) {
  const p = params.pic
  const city = params.city
  const name = p.filename.substring(0, p.filename.indexOf("."))
  const e = p.exif!
  const { width, height } = calcSize(e, 1000)
  return (
    <div className="relative h-max">
      <Image
        src={p.url}
        width={width}
        height={height}
        alt={`${city} ${name}`}
        priority={true}
      />
      <div
        className={`p-2 text-xs font-light text-white absolute bottom-0 bg-gray-500/50`}
      >
        <div className="flex flex-col justify-start">
          <span className="mb-0">{e.DateTimeOriginal}</span>
          <div className="flex gap-2">
            <span>
              {e.Make} {e.Model} {e.LensModel.replace(/\0/g, "")}
            </span>
            <span>{e.LensModel.replace(/\0/g, "")}</span>
          </div>
          <div className="flex gap-2">
            <span>{e.FocalLength}</span>
            <span>({e.FocalLengthIn35mmFormat}mm)</span>
            <span>{e.FNumber}</span>
            <span>{e.ExposureTime}S</span>
            <span>ISO {e.ISO}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

async function CityPage({ params }: { params: { city: string } }) {
  const city = params.city
  const picsInLoc: PicsInLoc[] = await getProjects({
    params: { city },
  })

  const ogp = `https://phantomtype.com${picsInLoc[0].pics[0].url}`
  return (
    <>
      <Head>
        <meta property="og:title" content="PHANTOM TYPE" />
        <meta property="og:description" content="Japan photo gallery" />
        <meta property="og:image" content={ogp} />
        <meta name="twitter:image" content={ogp} />
      </Head>
      <FixedNav city={city} />
      <div className="grid gap-16 grid-rows-1 z-0">
        <h2 className="mt-16 text-4xl text-center uppercase">{city}</h2>
        {picsInLoc.map((p) => (
          <section className="my-8 mx-1">
            <h3 className="text-center text-3xl my-8 uppercase">
              {p.location}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {p.pics
                .filter((p) => p.exif)
                .sort(byDatetime)
                .map((p, i) => {
                  return <Pic city={city} pic={p} />
                })}
            </div>
          </section>
        ))}
        <div className="my-8">
          <Nav />
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return ["kyoto", "/nagoya", "/kanazawa", "/matsushima"]
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

export async function getProjects({ params }) {
  const dirs = readDir(`public/${params.city}`)
  const pics: PicsInLoc[] = dirs.map((dir) => {
    const path = `public/${params.city}/${dir}`
    const files = fs.readdirSync(path)
    const picInLoc = files
      .filter((file) => file.toLowerCase().endsWith(".jpg"))
      .map((filePath) => {
        const exif = readExif(`${path}/${filePath}`)
        const pic: Photo = {
          filename: filePath,
          location: dir,
          url: `/${params.city}/${dir}/${filePath}`,
          exif: exif,
        }
        // console.log(pic)
        return pic
      })
    return { location: dir, pics: picInLoc }
  })
  // console.log(pics)
  return pics
}

export default CityPage
