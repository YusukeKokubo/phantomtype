type Manifest = Record<string, { file: string; src: string }>

let manifest: Manifest | null = null

export function loadManifest(): Manifest {
  if (manifest) return manifest

  // 開発環境では空のマニフェスト
  if (typeof import.meta.env !== "undefined" && import.meta.env.DEV) {
    return {}
  }

  // 本番環境ではマニフェストを読み込む
  // Cloudflare Workerでは動的にimportする必要がある
  try {
    // ビルド時にViteがマニフェストを生成する
    // 実際のパスはビルド設定に依存
    manifest = {}
    return manifest
  } catch {
    return {}
  }
}

/**
 * ソースファイルパスから本番環境のビルド済みファイルパスを取得
 * 開発環境ではそのままソースパスを返す
 */
export function getClientScript(sourcePath: string): string {
  const isDev = typeof import.meta.env !== "undefined" && import.meta.env.DEV

  if (isDev) {
    return `/${sourcePath}`
  }

  // 本番環境ではマニフェストから解決
  const manifest = loadManifest()
  const entry = manifest[sourcePath]
  return entry ? `/${entry.file}` : `/${sourcePath}`
}
