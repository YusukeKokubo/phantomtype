import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"
import type { Exif } from "../@types/Photo"
import app from "../src/index"

interface City {
  city: string
  locations: Array<{
    location: string
    pics: Array<{
      filename: string
      city: string
      location: string
      url: string
      exif: Exif | null
    }>
  }>
}

async function buildSSG() {
  console.log("Building static site...")

  // Set PUBLIC_HOST for OGP tags
  const PUBLIC_HOST = process.env.PUBLIC_HOST || "https://phantomtype.com"

  // Clean dist directory
  const distDir = join(process.cwd(), "dist")
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true })
  }
  mkdirSync(distDir, { recursive: true })

  // Load cities data
  const citiesData: City[] = JSON.parse(
    readFileSync(join(process.cwd(), "public", "pics.json"), "utf-8"),
  )

  // Build home page
  console.log("Building home page...")
  const homeRes = await app.request("http://localhost/", undefined, {
    PUBLIC_HOST,
  })
  const homeHtml = await homeRes.text()
  writeFileSync(join(distDir, "index.html"), homeHtml)
  console.log("✓ Home page built")

  // Build city pages
  for (const cityData of citiesData) {
    const cityName = cityData.city
    console.log(`Building ${cityName} page...`)

    try {
      const cityRes = await app.request(
        `http://localhost/${cityName}`,
        undefined,
        { PUBLIC_HOST },
      )
      const cityHtml = await cityRes.text()

      // Create city directory
      const cityDir = join(distDir, cityName)
      mkdirSync(cityDir, { recursive: true })

      // Write city page
      writeFileSync(join(cityDir, "index.html"), cityHtml)
      console.log(`✓ ${cityName} page built`)
    } catch (error) {
      console.error(`Error building ${cityName} page:`, error)
    }
  }

  // Copy public directory to dist
  console.log("Copying public assets...")
  const publicDir = join(process.cwd(), "public")
  cpSync(publicDir, distDir, { recursive: true })
  console.log("✓ Public assets copied")

  console.log("\nStatic site generation completed!")
  console.log(`Output directory: ${distDir}`)
}

buildSSG().catch((error) => {
  console.error("Build failed:", error)
  process.exit(1)
})
