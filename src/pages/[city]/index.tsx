import { NextPage } from 'next'
import Image from 'next/image'

import { Photo } from '../../../@types/Photo';

import fs from "fs"
import sharp, { Metadata } from 'sharp'
import { convertToLocalTime } from 'date-fns-timezone'
import Fraction from 'fraction.js'
import { format } from 'date-fns'
import React from 'react';
import { FixedNav } from '../../components/Nav';
const exifreader = require('exif-reader')

const CityPage: NextPage<{ city: string, picsData: any }> = ({ city, picsData }) => {
  const pics: Photo[] = picsData
  console.log(pics)
  return (
    <>
      <FixedNav city={city} />
      <div className='grid gap-16 grid-rows-1'>
        <h2 className='mt-16 text-4xl text-center uppercase'>{city}</h2>
        {/* {
          shuffle(pics).map((p, i) => {
            return <PhotoView fb={firebase.app()} key={i} photo={p} align={i % 2} />;
          })
        } */}
        {pics.map((p, i) => {
          const align = i % 2
          return (
            <section key={p.filename} className={` flex flex-col ${align === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <Image src={p.url} unsized className='w-full md:w-70v h-auto min-h-300' />
              <div className={`mx-3 text-base font-light flex flex-col ${align === 1 ? 'text-right' : null}`}>
                <div className='flex flex-col justify-start'>
                  <span className='text-xl mb-2'>{p.exif?.DateTimeOriginal}</span>
                  <span>{p.image?.Make} {p.image?.Model}</span>
                  <span>{p.exif?.LensModel.replace(/\0/g, '')}</span>
                  <span className='mt-2'>{p.exif?.FocalLength} ({p.exif?.FocalLengthIn35mmFormat})mm | F{p.exif?.FNumber} | {p.exif?.ExposureTime}S</span>
                  <span>ISO {p.exif?.ISO}</span>
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
  const f = 'yyyy/MM/dd HH:mm:ss'
  const dir = fs.readdirSync(`public/${params.city}`)
  const pics = await Promise.all(
    dir.filter(d => d.endsWith('.jpg')).map(async file => {
      const p = fs.readFileSync(`./public/${params.city}/${file}`)
      console.log(file)
      const exif = await sharp(p).metadata().then((m: Metadata) => {
        const ex = exifreader(m.exif)
        ex.exif.DateTimeOriginal = format(convertToLocalTime(ex.exif.DateTimeOriginal, { timeZone: 'Asia/Tokyo' }), f)
        ex.exif.DateTimeDigitized = format(convertToLocalTime(ex.exif.DateTimeDigitized, { timeZone: 'Asia/Tokyo' }), f)
        ex.image.ModifyDate = format(convertToLocalTime(ex.image.ModifyDate, { timeZone: 'Asia/Tokyo' }), f)
        ex.exif.ExposureTime = new Fraction(ex.exif.ExposureTime).toFraction()
        ex.exif.ApertureValue = new Fraction(ex.exif.ApertureValue).toFraction()
        ex.exif.ShutterSpeedValue = new Fraction(ex.exif.ShutterSpeedValue).toFraction()
        ex.exif.ExifVersion = ''
        ex.exif.FileSource = ''
        ex.exif.SceneType = ''
        ex.exif.CFAPattern = ''
        ex.exif.ComponentsConfiguration = ''
        ex.exif.UserComment = ''
        ex.exif.FlashpixVersion = ''
        ex.image.PrintIM = ''
        // console.log(ex)
        return ex
      }).catch(err => {
        console.error(err)
      })
      return {
        filename: file,
        url: `/${params.city}/${file}`,
        exif: exif.exif,
        image: exif.image
        // meta
      }
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
