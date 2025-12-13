import { Hono } from "hono"
import { serveStatic } from "hono/cloudflare-workers"
import { renderer } from "./renderer"
import HomePage from "./pages/home"
import CityPage from "./pages/city"
import citiesData from "../public/pics.json"
import { City } from "../@types/Photo"
import type { AppEnv } from "../@types/hono"

const app = new Hono<AppEnv>()

// Apply renderer middleware
app.use(renderer)

// Serve static files
app.use("/pics/*", serveStatic())
app.use("/*.{svg,jpg,css}", serveStatic())
app.use("/styles.css", serveStatic())

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

export default app
