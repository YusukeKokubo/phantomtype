import manifest from "virtual:client-manifest"

type ManifestEntry = {
  file: string
  src?: string
}

type Manifest = Record<string, ManifestEntry>

function findManifestEntry(
  entries: Manifest,
  sourcePath: string
): ManifestEntry | undefined {
  const normalized = sourcePath.replace(/^\.\//, "")
  const keys = [sourcePath, normalized, `./${normalized}`]

  for (const key of keys) {
    const entry = entries[key]
    if (entry) {
      return entry
    }
  }

  return undefined
}

/**
 * ソースファイルパスから本番環境のビルド済みファイルパスを取得
 * 開発環境ではそのままソースパスを返す
 */
export function getClientScript(sourcePath: string): string {
  if (typeof import.meta.env !== "undefined" && import.meta.env.DEV) {
    return `/${sourcePath}`
  }

  const entry = findManifestEntry(manifest, sourcePath)
  if (!entry) {
    throw new Error(
      `Client script not found in Vite manifest: ${sourcePath}. Add it to vite.config.ts build.rollupOptions.input.`,
    )
  }

  return `/${entry.file.replace(/^\//, "")}`
}
