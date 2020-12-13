import { NextPage } from 'next'
import Image from 'next/image'

import { Exif, Photo } from '../../../@types/Photo';

import fs from "fs"
import React from 'react';
import { FixedNav } from '../../components/Nav';
import * as ExifReader from 'exifreader';

type PicsInLoc = {
  location: string,
  pics: Photo[]
}

function byDatetime(a: Photo, b: Photo): number {
  return b.exif!.DateTimeOriginal < a.exif!.DateTimeOriginal ? 1 : -1
}

function calcSize(exif: Exif, length: number): { width: number, height: number } {
  const width = exif.ImageWidth
  const height = exif.ImageLength
  const align = width > height ? 'horizon' : 'vertical'

  if (align == 'horizon') {
    const new_w = length
    const new_h = (height * new_w) / width
    return { width: new_w, height: new_h }
  } else {
    const new_h = length
    const new_w = (width * new_h) / height
    return { width: new_w, height: new_h }
  }
}

const Pic: NextPage<{ city: string, pic: Photo, align: number }> = ({ city, pic, align }) => {
  const p = pic
  // const align = i % 2
  const name = p.filename.substring(0, p.filename.indexOf('.'))
  const e = p.exif!
  const { width, height } = calcSize(e, 1000)
  return (
    <div className={`my-6 flex flex-col ${align === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      <Image src={p.url} width={width} height={height} alt={`${city} ${name}`} />
      <div className={`mx-3 text-base font-light flex flex-col ${align === 1 ? 'text-right' : null}`}>
        <div className='flex flex-col justify-start'>
          <span className='text-xl mb-0'>{e.DateTimeOriginal}</span>
          {/* <span className='text-xl mb-2'>{name}</span> */}
          <span>{e.Make} {e.Model}</span>
          <span>{e.LensModel.replace(/\0/g, '')}</span>
          <span className='mt-2'>{e.FocalLength} ({e.FocalLengthIn35mmFormat}) | {e.FNumber} | {e.ExposureTime}S</span>
          <span>ISO {e.ISO}</span>
        </div>
      </div>
    </div>
  )
}

const Location: NextPage<{ city: string, picsInLoc: PicsInLoc }> = ({ city, picsInLoc }) => {
  const pics = picsInLoc.pics
  const loc = picsInLoc.location
  return (
    <section className='my-8'>
      <h3 className='text-center text-3xl my-8 uppercase'>{loc}</h3>
      {
        pics.filter(p => p.exif).sort(byDatetime).map((p, i) => {
          return <Pic key={p.url} city={city} pic={p} align={i % 2} />
        })
      }
    </section>
  )
}

const CityPage: NextPage<{ city: string, picsData: any }> = ({ city, picsData }) => {
  const picsInLoc: PicsInLoc[] = picsData
  return (
    <>
      <FixedNav city={city} />
      <div className='grid gap-16 grid-rows-1'>
        <h2 className='mt-16 text-4xl text-center uppercase'>{city}</h2>
        {picsInLoc.map(p => {
          return <Location key={p.location} city={city} picsInLoc={p} />
        })}
      </div>
    </>
  )
};

export async function getStaticPaths() {
  return {
    paths: ['/kyoto', '/nagoya', '/kanazawa', '/matsushima'],
    fallback: false
  }
}

const readDir = (dirPath: string) => {
  const dirs = fs.readdirSync(dirPath, { withFileTypes: true })
  return dirs.filter(d => d.isDirectory()).map(d => d.name)
}

const readExif = (filePath: string): Exif | null => {
  const p = fs.readFileSync(`${filePath}`)
  console.log(filePath)
  const tags = ExifReader.load(p, { expanded: true })
  const exif = tags.exif!
  const tFile = tags.file!
  if (!exif || !tFile) {
    console.error('Image has not exif.')
    return null
  }
  const dateTimeOriginal = exif.DateTimeOriginal.description
  const make = exif.Make.description
  const model = exif.Model.description
  const lensMake = exif['LensMake']?.description || ''
  const lensModel = exif['LensModel']?.description || ''
  const focalLength = exif.FocalLength.description
  const focalLengthIn35mm = exif.FocalLengthIn35mmFilm.description
  const fnumber = exif.FNumber.description
  const exposureTime = exif.ExposureTime.description
  const iso = exif.ISOSpeedRatings.description
  return {
    ImageWidth: tFile["Image Width"]?.value!,
    ImageLength: tFile["Image Height"]?.value!,
    Make: make,
    Model: model,
    DateTimeOriginal: dateTimeOriginal,
    LensMake: lensMake,
    LensModel: lensModel,
    FocalLength: focalLength,
    FocalLengthIn35mmFormat: focalLengthIn35mm,
    FNumber: fnumber,
    ExposureTime: exposureTime,
    ISO: iso
  }
}

export async function getStaticProps({ params }) {
  const dirs = readDir(`public/${params.city}`)
  const pics: PicsInLoc[] =
    dirs.map(dir => {
      const path = `public/${params.city}/${dir}`
      const files = fs.readdirSync(path)
      const picInLoc = files.filter(file => file.toLowerCase().endsWith('.jpg')).map(filePath => {
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
  return {
    props: {
      city: params.city,
      picsData: pics
    }
  }
}


export default CityPage;
