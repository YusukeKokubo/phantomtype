import { Hono } from "hono"
import HomePage from "../pages/home"
import CityPage from "../pages/city"
import PhotoPage from "../pages/photo"
import YusukePage from "../pages/yusuke"
import citiesData from "../../public/pics.json"
import type { City, Photo } from "../../@types/Photo"
import type { AppEnv } from "../../@types/hono"

/** Gallery city slug として扱わない固定パス（staticPages で処理） */
const RESERVED_CITY_SLUGS = new Set(["yusuke"])

/**
 * ページルートを登録する。
 * マウント順: staticPages（/, /yusuke）→ cityPages（写真詳細 → 都市一覧）
 */
export function createPageRoutes() {
  const staticPages = new Hono<AppEnv>()

  staticPages.get("/", (c) => {
    const cities: City[] = citiesData as City[]
    const publicHost = c.env.PUBLIC_HOST || ""

    c.set("title", "PHANTOM TYPE")
    c.set("description", "Japan photo gallery")
    c.set("ogImage", `${publicHost}/ogkyoto.jpg`)
    c.set("ogUrl", publicHost)
    return c.render(<HomePage cities={cities} />)
  })

  staticPages.get("/yusuke", (c) => {
    const publicHost = c.env.PUBLIC_HOST || ""

    c.set("title", "Yusuke Kokubo - PHANTOM TYPE")
    c.set("description", "About Yusuke Kokubo")
    c.set("ogImage", `${publicHost}/ogkyoto.jpg`)
    c.set("ogUrl", `${publicHost}/yusuke`)

    return c.render(<YusukePage />)
  })

  const cityPages = new Hono<AppEnv>()

  cityPages.get("/:city/photo/:filename", (c) => {
    const city = c.req.param("city")
    const filename = decodeURIComponent(c.req.param("filename"))
    const cities: City[] = citiesData as City[]
    const cityPics = cities.find((p) => p.city === city)

    if (!cityPics) {
      return c.notFound()
    }

    let photo: Photo | undefined
    for (const location of cityPics.locations) {
      photo = location.pics.find((p) => p.filename === filename)
      if (photo) break
    }

    if (!photo) {
      return c.notFound()
    }

    const publicHost = c.env.PUBLIC_HOST || ""
    const ogImage = `${publicHost}${photo.url}`

    let description = `Photo from ${city}`
    if (photo.exif) {
      const exif = photo.exif
      const location = cityPics.locations.find((loc) =>
        loc.pics.some((p) => p.filename === filename),
      )
      const locationName = location ? location.location : ""

      description = `${locationName ? `${locationName}, ` : ""}${city}. `
      description += `Shot on ${exif.DateTimeOriginal} with ${exif.Make} ${exif.Model}`
      if (exif.LensModel) {
        description += ` using ${exif.LensModel.replace(/\0/g, "")}`
      }
    }

    const nameWithoutExt =
      filename.substring(0, filename.lastIndexOf(".")) || filename

    const requestUrl = new URL(c.req.url)
    const ogUrl = publicHost
      ? `${publicHost}/${city}/photo/${encodeURIComponent(filename)}`
      : `${requestUrl.origin}/${city}/photo/${encodeURIComponent(filename)}`

    c.set("title", `PHANTOM TYPE - ${city.toUpperCase()} - ${nameWithoutExt}`)
    c.set("description", description)
    c.set("ogImage", ogImage)
    c.set("ogUrl", ogUrl)

    if (photo.exif) {
      c.set("ogImageWidth", photo.exif.ImageWidth.toString())
      c.set("ogImageHeight", photo.exif.ImageLength.toString())
    }

    return c.render(<PhotoPage city={city} photo={photo} cities={cities} />)
  })

  cityPages.get("/:city", (c) => {
    const city = c.req.param("city")

    if (RESERVED_CITY_SLUGS.has(city)) {
      return c.notFound()
    }

    const cities: City[] = citiesData as City[]
    const cityPics = cities.find((p) => p.city === city)

    if (!cityPics) {
      return c.notFound()
    }

    const publicHost = c.env.PUBLIC_HOST || ""
    const firstLocation = cityPics.locations[0]
    const firstPic = firstLocation?.pics[0]
    if (!firstPic) {
      return c.notFound()
    }
    const ogImage = `${publicHost}${firstPic.url}`

    c.set("title", `PHANTOM TYPE - ${city.toUpperCase()}`)
    c.set("description", "Japan photo gallery")
    c.set("ogImage", ogImage)
    c.set("ogUrl", `${publicHost}/${city}`)
    return c.render(<CityPage city={city} cityPics={cityPics} cities={cities} />)
  })

  const pages = new Hono<AppEnv>()
  pages.route("/", staticPages)
  pages.route("/", cityPages)
  return pages
}
