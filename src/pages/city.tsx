import type { City, Exif, Photo } from "../../@types/Photo"
import { Header, Nav } from "../components/Nav"

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
  const photoUrl = `/${city}/photo/${encodeURIComponent(p.filename)}`
  return (
    <a
      href={photoUrl}
      class="block relative h-max cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label={`${city} ${name}の写真を見る`}
    >
      <img
        src={p.url}
        width={width}
        height={height}
        alt={`${city} ${name}の写真`}
        loading="lazy"
      />
      <div
        class={`p-2 text-xs font-light text-foreground absolute bottom-0 bg-surface-overlay`}
      >
        <div class="flex flex-col justify-start">
          <span class="mb-0">{e.DateTimeOriginal}</span>
          <div class="flex gap-2">
            <span>
              {e.Make} {e.Model}
            </span>
            <span>{e.LensModel.replace(/\0/g, "")}</span>
          </div>
          <div class="flex gap-2">
            <span>{e.FocalLength}</span>
            <span>({e.FocalLengthIn35mmFormat}mm)</span>
            <span>{e.FNumber}</span>
            <span>{e.ExposureTime}S</span>
            <span>ISO {e.ISO}</span>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function CityPage({
  city,
  cityPics,
  cities,
}: {
  city: string
  cityPics: City
  cities: City[]
}) {
  return (
    <>
      <a href="#main-content" class="skip-link">
        メインコンテンツへスキップ
      </a>
      <div class="flex flex-col gap-8 mb-8">
        <Header city={city} cities={cities} />
        <main id="main-content">
          <h1 class="text-4xl text-center uppercase">{city}</h1>
          {cityPics.locations.map((loc, loc_i) => (
            <section key={loc_i} class="py-8 px-1 flex flex-col gap-2">
              <h2 class="text-center text-3xl uppercase">{loc.location}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-1" role="list">
                {loc.pics
                  .filter((p) => p.exif)
                  .sort(byDatetime)
                  .map((p, p_i) => (
                    <Pic city={city} pic={p} key={p_i} />
                  ))}
              </div>
            </section>
          ))}
        </main>
        <Nav city={city} cities={cities} />
      </div>
    </>
  )
}
