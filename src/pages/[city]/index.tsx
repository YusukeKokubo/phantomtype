import { NextPage } from 'next'
import Image from 'next/image'

import { Photo } from '../../../@types/Photo';

const CityPage: NextPage<{ city: string, picsData: any }> = ({ city, picsData }) => {
  const pics: Photo[] = picsData
  console.log(pics)
  return (
    <>
      {/* <FixedNav city={city} /> */}
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
              <Image src={p.url} width={320} height={160} className='w-full md:w-70v h-auto min-h-300' />
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

import fs from "fs"
import sharp, { Metadata } from 'sharp'
import { convertToLocalTime } from 'date-fns-timezone'
import Fraction from 'fraction.js'
import { format } from 'date-fns'
const exifreader = require('exif-reader')

export async function getStaticProps({ params }) {
  // TODO: sanitize file path
  const dir = fs.readdirSync('public/kyoto')
  const pics = await Promise.all(
    dir.map(async file => {
      const p = fs.readFileSync(`./public/kyoto/${file}`)
      const { meta, exif } = await sharp(p).metadata().then((m: Metadata) => {
        const ex = exifreader(m.exif)
        ex.exif.DateTimeOriginal = format(convertToLocalTime(ex.exif.DateTimeOriginal, { timeZone: 'Asia/Tokyo' }), 'yyyy')
        ex.exif.DateTimeDigitized = format(convertToLocalTime(ex.exif.DateTimeDigitized, { timeZone: 'Asia/Tokyo' }), 'yyyy')
        ex.image.ModifyDate = format(convertToLocalTime(ex.image.ModifyDate, { timeZone: 'Asia/Tokyo' }), 'yyyy')
        ex.exif.ExposureTime = new Fraction(ex.exif.ExposureTime).toFraction()
        ex.exif.ApertureValue = new Fraction(ex.exif.ApertureValue).toFraction()
        ex.exif.ShutterSpeedValue = new Fraction(ex.exif.ShutterSpeedValue).toFraction()
        ex.exif.ExifVersion = ''
        ex.exif.FileSource = ''
        ex.exif.SceneType = ''
        return { meta: m, exif: ex }
      })
      return {
        filename: file,
        url: `/kyoto/${file}`,
        exif: exif.exif,
        // meta
      }
    })
  )
  console.log(pics)
  return {
    props: {
      city: params.city,
      picsData: pics
    }
  }
}


export default CityPage;
