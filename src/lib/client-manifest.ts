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

  // 本番環境では固定のビルド済みパスを使用
  // vite.config.tsの設定に基づく
  if (sourcePath === "src/yusuke/client/yusuke-client.tsx") {
    return "/client/yusuke-client.js"
  }

  // フォールバック
  return `/${sourcePath}`
}
