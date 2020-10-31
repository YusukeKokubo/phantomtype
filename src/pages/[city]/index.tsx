import { NextPage } from 'next'
import Image from 'next/image'

import { Photo } from '../../../@types/Photo';

import fs from "fs"
import React from 'react';
import { FixedNav } from '../../components/Nav';
import * as ExifReader from 'exifreader';

const CityPage: NextPage<{ city: string, picsData: any }> = ({ city, picsData }) => {
  const pics: Photo[] = picsData
  return (
    <>
      <FixedNav city={city} />
      <div className='grid gap-16 grid-rows-1'>
        <h2 className='mt-16 text-4xl text-center uppercase'>{city}</h2>
        {pics.map((p, i) => {
          const align = i % 2
          return (
            <section key={p.filename} className={` flex flex-col ${align === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <Image src={p.url} unsized className='w-full md:w-70v h-auto min-h-300' />
              <div className={`mx-3 text-base font-light flex flex-col ${align === 1 ? 'text-right' : null}`}>
                <div className='flex flex-col justify-start'>
                  <span className='text-xl mb-2'>{p.exif.DateTimeOriginal}</span>
                  <span>{p.exif.Make} {p.exif.Model}</span>
                  <span>{p.exif.LensModel.replace(/\0/g, '')}</span>
                  <span className='mt-2'>{p.exif.FocalLength} ({p.exif.FocalLengthIn35mmFormat}) | {p.exif.FNumber} | {p.exif.ExposureTime}S</span>
                  <span>ISO {p.exif.ISO}</span>
                </div>
              </div>
            </section>
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
      console.log(file)
      const tags = ExifReader.load(p)
      const dateTimeOriginal = tags['DateTimeOriginal'].description
      const make = tags['Make'].description
      const model = tags['Model'].description
      const lensMake = tags['LensMake']?.description || ''
      const lensModel = tags['LensModel']?.description || ''
      const focalLength = tags['FocalLength'].description
      const focalLengthIn35mm = tags['FocalLengthIn35mmFilm'].description
      const fnumber = tags['FNumber'].description
      const exposureTime = tags['ExposureTime'].description
      const iso = tags['ISOSpeedRatings'].description
      const pic: Photo = {
        filename: file,
        url: `/${params.city}/${file}`,
        exif: {
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
      console.log(pic)
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
