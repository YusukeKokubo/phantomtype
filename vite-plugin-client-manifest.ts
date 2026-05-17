import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

const VIRTUAL_ID = "virtual:client-manifest"
const RESOLVED_ID = "\0virtual:client-manifest"

const MANIFEST_CANDIDATES = [
  "dist/client/.vite/manifest.json",
  "dist/.vite/manifest.json",
]

function readManifestFromDisk(root: string): string {
  for (const relativePath of MANIFEST_CANDIDATES) {
    const manifestPath = path.resolve(root, relativePath)
    if (existsSync(manifestPath)) {
      return readFileSync(manifestPath, "utf-8")
    }
  }
  return "{}"
}

export function clientManifestPlugin(): Plugin {
  let root = process.cwd()
  let isServe = true
  let cachedManifest = "{}"

  return {
    name: "phantomtype-client-manifest",
    configResolved(config) {
      root = config.root
      isServe = config.command === "serve"
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID
      }
    },
    load(id) {
      if (id !== RESOLVED_ID) {
        return
      }

      if (isServe) {
        return "export default {}"
      }

      const manifest = cachedManifest !== "{}" ? cachedManifest : readManifestFromDisk(root)
      return `export default ${manifest}`
    },
    writeBundle(options) {
      const manifestPath = path.join(options.dir, ".vite/manifest.json")
      if (existsSync(manifestPath)) {
        cachedManifest = readFileSync(manifestPath, "utf-8")
      }
    },
    closeBundle() {
      if (cachedManifest === "{}") {
        cachedManifest = readManifestFromDisk(root)
      }
    },
  }
}
