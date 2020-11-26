import { NextPage } from 'next'
import Image from 'next/image'

import { Exif, Photo } from '../../../@types/Photo';

import fs from "fs"
import React from 'react';
import { FixedNav } from '../../components/Nav';
import * as ExifReader from 'exifreader';

function byDatetime(a: Photo, b: Photo): number {
  return b.exif.DateTimeOriginal > a.exif.DateTimeOriginal ? 1 : -1
}

function calcSize(exif: Exif): { width: number, height: number } {
  const n = 6
  const width = exif.ImageWidth
  const height = exif.ImageLength
  if (exif.ImageWidth > 1024 && exif.ImageWidth > 1024) {
  return { width: width / n, height: height / n }
  } else {
  return { width, height }
  }
}

const CityPage: NextPage<{ city: string, picsData: any }> = ({ city, picsData }) => {
  const pics: Photo[] = picsData
  return (
    <>
      <FixedNav city={city} />
      <div className='grid gap-16 grid-rows-1'>
        <h2 className='mt-16 text-4xl text-center uppercase'>{city}</h2>
        {pics.sort(byDatetime).map((p, i) => {
          const align = i % 2
          const name = p.filename.substring(0, p.filename.indexOf('.'))
          const e = p.exif
          const { width, height } = calcSize(e)
          return (
            <div key={p.filename} className={`flex flex-col ${align === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <Image src={p.url} width={width} height={height} alt={`${city} ${name}`} />
              <div className={`mx-3 text-base font-light flex flex-col ${align === 1 ? 'text-right' : null}`}>
                <div className='flex flex-col justify-start'>
                  <span className='text-xl mb-0'>{e.DateTimeOriginal}</span>
                  <span className='text-xl mb-2'>{name}</span>
                  <span>{e.Make} {e.Model}</span>
                  <span>{e.LensModel.replace(/\0/g, '')}</span>
                  <span className='mt-2'>{e.FocalLength} ({e.FocalLengthIn35mmFormat}) | {e.FNumber} | {e.ExposureTime}S</span>
                  <span>ISO {e.ISO}</span>
                </div>
              </div>
            </div>
          )
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

export async function getStaticProps({ params }) {
  const dir = fs.readdirSync(`public/${params.city}`)
  const pics: Photo[] = await Promise.all(
    dir.filter(d => d.endsWith('.jpg')).map(async file => {
      const p = fs.readFileSync(`./public/${params.city}/${file}`)
      // console.debug(file)
      const tags = ExifReader.load(p, { expanded: true })
      // console.log(tags)
      const exif = tags.exif!
      const tFile = tags.file!
      if (!exif || !tFile) {
        console.error('Image has not exif.')
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
      const pic: Photo = {
        filename: file,
        url: `/${params.city}/${file}`,
        exif: {
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
        },
      }
      // console.log(pic)
      return pic
    })
  )
  // console.log(pics)
  return {
    props: {
      city: params.city,
      picsData: pics
    }
  }
}


export default CityPage;
