import { Exif, Photo, City } from "../../@types/Photo"

import React from "react"
import { Header, Nav } from "../components/Nav"
import { Metadata } from "next"
import Image from "next/image"

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

export async function generateMetadata({ params }): Promise<Metadata> {
  const cities: City[] = await getProjects()
  const cityPics = cities.find((p) => p.city == params.city)
  if (!cityPics) {
    console.error(`city [${params.city}] not found`)
    return {}
  }

  const ogp = `${process.env.NEXT_PUBLIC_HOST}${cityPics.locations[0].pics[0].url}`

  return {
    title: `PHANTOM TYPE - ${params.city.toUpperCase()}`,
    openGraph: {
      images: [ogp],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@yusuke_kokubo",
      images: ogp,
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: { city: string }
}) {
  const cityName = params.city
  const cities: City[] = await getProjects()

  const cityPics = cities.find((p) => p.city == cityName)
  if (!cityPics) {
    console.error(`city [${cityName}] not found`)
    return <></>
  }

  return (
    <>
      <Header city={cityName} />
      <div className="grid gap-16 grid-rows-1 z-0">
        <h2 className="mt-16 text-4xl text-center uppercase">{cityName}</h2>
        {cityPics.locations.map((loc, loc_i) => (
          <section className="my-8 mx-1" key={loc_i}>
            <h3 className="text-center text-3xl my-8 uppercase">
              {loc.location}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {loc.pics
                .filter((p) => p.exif)
                .sort(byDatetime)
                .map((p, p_i) => (
                  <Pic city={cityName} pic={p} key={p_i} />
                ))}
            </div>
          </section>
        ))}
        <div className="my-8">
          <Nav city={cityName} />
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return ["kyoto", "nagoya", "kanazawa", "matsushima"]
}

async function getProjects() {
  const url = `${process.env.NEXT_PUBLIC_HOST}/pics.json`

  const pics = await fetch(url)
    .then((res) => res.json())
    .catch((e) => {
      console.error(e)
      return {}
    })
  // console.debug(pics)
  return pics
}
