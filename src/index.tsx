import { Hono } from "hono"
import { serveStatic } from "hono/cloudflare-workers"
import { renderer } from "./renderer"
import HomePage from "./pages/home"
import CityPage from "./pages/city"
import PhotoPage from "./pages/photo"
import citiesData from "../public/pics.json"
import { City, Photo } from "../@types/Photo"
import type { AppEnv } from "../@types/hono"

const app = new Hono<AppEnv>()

// Normalize paths (remove trailing slashes except for root)
app.use("*", async (c, next) => {
  const url = new URL(c.req.url)
  const pathname = url.pathname

  // Remove trailing slash except for root
  if (pathname !== "/" && pathname.endsWith("/")) {
    return c.redirect(pathname.slice(0, -1), 301)
  }

  await next()
})

// Apply renderer middleware
app.use(renderer)

// Home page
app.get("/", (c) => {
  const cities: City[] = citiesData as City[]
  const publicHost = c.env.PUBLIC_HOST || ""

  c.set("title", "PHANTOM TYPE")
  c.set("description", "Japan photo gallery")
  c.set("ogImage", `${publicHost}/ogkyoto.jpg`)
  c.set("ogUrl", publicHost)
  return c.render(<HomePage cities={cities} />)
})

// Photo detail pages (must be before city pages to avoid route conflicts)
app.get("/:city/photo/:filename", (c) => {
  const city = c.req.param("city")
  const filename = decodeURIComponent(c.req.param("filename"))
  const cities: City[] = citiesData as City[]
  const cityPics = cities.find((p) => p.city === city)

  if (!cityPics) {
    return c.notFound()
  }

  // Find the photo by filename
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

  c.set("title", `PHANTOM TYPE - ${city.toUpperCase()} - ${filename}`)
  c.set("description", "Japan photo gallery")
  c.set("ogImage", ogImage)
  c.set("ogUrl", `${publicHost}/${city}/photo/${encodeURIComponent(filename)}`)
  return c.render(<PhotoPage city={city} photo={photo} cities={cities} />)
})

// City pages
app.get("/:city", (c) => {
  const city = c.req.param("city")
  const cities: City[] = citiesData as City[]
  const cityPics = cities.find((p) => p.city === city)

  if (!cityPics) {
    return c.notFound()
  }

  const publicHost = c.env.PUBLIC_HOST || ""
  const ogImage = `${publicHost}${cityPics.locations[0].pics[0].url}`

  c.set("title", `PHANTOM TYPE - ${city.toUpperCase()}`)
  c.set("description", "Japan photo gallery")
  c.set("ogImage", ogImage)
  c.set("ogUrl", `${publicHost}/${city}`)
  return c.render(<CityPage city={city} cityPics={cityPics} cities={cities} />)
})

// Serve static files (must be after dynamic routes)
app.use("/pics/*", serveStatic({ root: "./public", manifest: {} }))
app.use("/*.{svg,jpg,css}", serveStatic({ root: "./public", manifest: {} }))
app.use("/styles.css", serveStatic({ root: "./public", manifest: {} }))

export default app
