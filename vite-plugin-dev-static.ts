import { createReadStream, existsSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".css": "text/css",
  ".js": "application/javascript",
}

export function devStaticPlugin(): Plugin {
  return {
    name: "phantomtype-dev-static",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/"
        if (!url.startsWith("/pics/") && !url.startsWith("/yusuke/")) {
          return next()
        }

        const decoded = decodeURIComponent(url.split("?")[0])
        const filePath = path.join(process.cwd(), "public", decoded)

        if (!existsSync(filePath)) {
          return next()
        }

        const ext = path.extname(filePath).toLowerCase()
        const contentType = MIME_TYPES[ext] || "application/octet-stream"
        res.setHeader("Content-Type", contentType)
        createReadStream(filePath).pipe(res)
      })
    },
  }
}
