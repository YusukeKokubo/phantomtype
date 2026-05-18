# ギャラリー表示改善計画

**ステータス: 未着手**

## 背景

Astro 移行後の基盤を活かして、写真ギャラリーの体感品質・パフォーマンス・SNS シェア体験を改善する。

## 改善案一覧

| # | 改善内容 | 難度 | 効果 |
|---|---------|------|------|
| 1 | LQIP（ぼかしプレースホルダー） | ★★☆ | 体感読み込み速度の大幅改善 |
| 2 | `astro:assets` WebP/AVIF 最適化 | ★★★ | 実転送量 40〜70% 削減 |
| 3 | 動的 OGP 画像生成 | ★★★ | SNS シェア時の見栄え改善 |

---

## 改善案 1: LQIP（ぼかしプレースホルダー）

**ステータス: 完了**

### 概要

写真読み込み中に tiny な base64 エンコード画像（約 20px）をプレースホルダーとして表示し、フル解像度画像のロード完了後にフェードインさせる。

### 実装方針

#### Step 1: `generatePics/` スクリプトを修正

`sharp` で各写真の縮小版（20px 幅）を生成し、base64 文字列として `pics.json` に追加する。

```ts
// generatePics/ に追加するイメージ
import sharp from "sharp"

const lqip = await sharp(filePath)
  .resize(20)
  .blur(2)
  .webp({ quality: 20 })
  .toBuffer()

const lqipBase64 = `data:image/webp;base64,${lqip.toString("base64")}`
```

#### Step 2: `@types/Photo.d.ts` に `lqip` フィールドを追加

```ts
export type Photo = {
  filename: string
  city: string
  location: string
  url: string
  lqip?: string   // 追加
  exif: Exif | null
}
```

#### Step 3: `PhotoCard.astro` に適用

```astro
<div
  class="relative overflow-hidden"
  style={photo.lqip ? `background-image: url(${photo.lqip}); background-size: cover;` : ""}
>
  <img
    src={encodeURI(photo.url)}
    class="transition-opacity duration-500 opacity-0 loaded:opacity-100"
    onload="this.classList.add('loaded')"
    ...
  />
</div>
```

### 注意事項

- `pics.json` の再生成が必要（`generatePics/` を実行し直す）
- `pics.json` のファイルサイズが増加するが、base64 の 20px 画像は 1 枚あたり 数百バイト程度
- `sharp` は `generatePics/` の devDependency に追加

---

## 改善案 2: `astro:assets` による WebP/AVIF 最適化

**ステータス: 未着手**

### 概要

写真ファイルを `public/pics/` から `src/assets/pics/` に移動し、Astro の `<Image>` コンポーネントでビルド時に WebP/AVIF 変換 + 複数サイズの `srcset` を自動生成する。
画像ファイルはリポジトリに含めず、`src/assets/pics/` を `.gitignore` に追加して管理する。ビルドはローカルから手動実行（`npm run deploy`）するため GitHub Actions は考慮しない。

### 実装方針

#### Step 1: 写真ファイルの移動 + `.gitignore` 追加

```
public/pics/ → src/assets/pics/
```

`.gitignore` に追加：

```
src/assets/pics/
```

#### Step 2: `generatePics/` スクリプトの修正

`src/assets/pics/` を起点にスキャンするよう変更。`pics.json` の `url` フィールドを `/src/assets/pics/...` 形式（glob キーと一致する絶対パス）に変更。

#### Step 3: `[city].astro` / `PhotoCard.astro` の修正

```astro
---
import { Image } from "astro:assets"
import type { ImageMetadata } from "astro"

// Vite の glob import でビルド時に解決
const allImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/pics/**/*.jpg"
)
---

<Image
  src={allImages[photo.url]()}
  widths={[400, 800, 1200]}
  formats={["avif", "webp"]}
  alt={...}
/>
```

### 注意事項

- **ビルド時間が大幅増加する**（写真枚数 × フォーマット数 × サイズ数の変換処理）
- Cloudflare Workers Assets へのデプロイ量も増加（元画像 + 変換後のキャッシュ）
- 枚数が多い場合はビルドキャッシュ（`.astro/` ディレクトリ）の管理が重要
- `pics.json` の `url` パスの形式変更が必要（`/pics/...` → `/src/assets/pics/...`）
- `src/assets/pics/` は `.gitignore` で管理外のため、新マシンや CI では別途画像を配置する必要がある

---

## 改善案 3: 動的 OGP 画像生成

**ステータス: 未着手**

### 概要

現在は写真 URL をそのまま OGP に使用しているが、Astro の API エンドポイント + `satori` で都市名・撮影情報をオーバーレイした OGP 画像をビルド時に静的生成する。

### 実装方針

#### Step 1: 依存関係の追加

```bash
npm install satori @resvg/resvg-js
```

#### Step 2: OGP 画像エンドポイントを作成

`src/pages/ogp/[city]/[...filename].png.ts` を作成：

```ts
import type { APIRoute } from "astro"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"

export const GET: APIRoute = async ({ params }) => {
  const svg = await satori(
    // JSX で OGP レイアウト定義（写真 + 都市名 + EXIF オーバーレイ）
    { type: "div", props: { ... } },
    { width: 1200, height: 630, fonts: [...] }
  )
  const resvg = new Resvg(svg)
  return new Response(resvg.render().asPng(), {
    headers: { "Content-Type": "image/png" },
  })
}
```

#### Step 3: `BaseLayout.astro` の OGP URL を差し替え

```astro
<meta property="og:image" content={`/ogp/${city}/${encodeURIComponent(filename)}.png`} />
```

### 注意事項

- `satori` は Node.js フォント読み込みが必要（日本語フォントは別途用意）
- ビルド時間が増加する（枚数分の画像生成）
- OGP 画像に埋め込む写真のリサイズも必要（`sharp` を使用）

---

## 優先順位の推奨

体感効果とコストのバランスから **改善案 1（LQIP）から着手することを推奨**。

- ファイル構成の変更なし
- `pics.json` の再生成のみで完結
- 最も体感品質に直結する

改善案 2 は効果が大きいが、ビルド時間・デプロイ量増加のトレードオフを十分に評価してから実施する。
