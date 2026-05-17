import { Hono } from "hono"
import { serveStatic } from "hono/cloudflare-workers"
import { renderer } from "./renderer"
import { createPageRoutes } from "./routes/pages"
import type { AppEnv } from "../@types/hono"

const app = new Hono<AppEnv>()

// Normalize paths (remove trailing slashes except for root)
app.use("*", async (c, next) => {
  const url = new URL(c.req.url)
  const pathname = url.pathname

  if (pathname !== "/" && pathname.endsWith("/")) {
    return c.redirect(pathname.slice(0, -1), 301)
  }

  await next()
})

app.use(renderer)
app.route("/", createPageRoutes())

// Serve static files (production only; in dev Vite serves public/ directly)
if (!import.meta.env.DEV) {
  app.use("/pics/*", serveStatic({ root: "./public", manifest: {} }))
  app.use("/yusuke/*", serveStatic({ root: "./public", manifest: {} }))
  app.use("/*.{svg,jpg,css,webp}", serveStatic({ root: "./public", manifest: {} }))
  app.use("/styles.css", serveStatic({ root: "./public", manifest: {} }))
}

export default app
