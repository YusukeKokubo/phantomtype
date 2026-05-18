# ギャラリー表示改善計画

**ステータス: 改善案 1・2 完了 / 改善案 3 未着手**

## 背景

Astro 移行後の基盤を活かして、写真ギャラリーの体感品質・パフォーマンス・SNS シェア体験を改善する。

## 改善案一覧

| # | 改善内容 | 難度 | 効果 | ステータス |
|---|---------|------|------|-----------|
| 1 | LQIP（ぼかしプレースホルダー） | ★★☆ | 体感読み込み速度の大幅改善 | **完了** |
| 2 | `astro:assets` WebP 最適化 | ★★★ | 実転送量 40〜70% 削減 | **完了**（WebP のみ、下記参照） |
| 3 | 動的 OGP 画像生成 | ★★★ | SNS シェア時の見栄え改善 | 未着手 |

---

## 改善案 1: LQIP（ぼかしプレースホルダー）

**ステータス: 完了**

### 概要

写真読み込み中に tiny な base64 エンコード画像（約 20px）をプレースホルダーとして表示し、フル解像度画像のロード完了後にフェードインさせる。

### 実装内容

- `generatePics/index.ts` — `sharp` で 20px WebP を生成し `pics.json` の `lqip` に格納
- `@types/Photo.d.ts` — `lqip?: string` を追加
- `PhotoCard.astro` / 写真詳細ページ — ぼかし背景 + `data-lqip` / `onload` で表示切替
- `PhotoDialog.ts` — ギャラリーカードの `data-lqip` を DOM から再利用

### 注意事項

- 新しい写真追加後は `generatePics/` を実行して `pics.json` を再生成する
- `pics.json` のファイルサイズは 1 枚あたり数百バイト程度増加

---

## 改善案 2: `astro:assets` による WebP 最適化

**ステータス: 完了**（当初計画からの変更あり）

### 概要

写真ファイルを `public/pics/` から `src/assets/pics/` に移動し、Astro の `<Image>` コンポーネントでビルド時に WebP 変換 + 複数サイズの `srcset` を自動生成する。
画像ファイルはリポジトリに含めず、`src/assets/pics/` を `.gitignore` に追加して管理する。ビルドはローカルから手動実行（`npm run deploy`）するため GitHub Actions は考慮しない。

### 当初計画からの変更（ビルド CPU 対策）

初回実装（`Picture` + AVIF/WebP + 幅 3〜4 種）ではビルド時の CPU 負荷が高すぎたため、以下に変更した。

| 項目 | 当初計画 | 実装 |
|------|---------|------|
| コンポーネント | `Picture` + `formats={["avif","webp"]}` | **`Image`（WebP のみ）** |
| ギャラリー幅 | 400, 800, 1200 | **800, 1200** |
| 詳細ページ幅 | 800, 1200, 1920 | **1200, 1920** |
| PhotoDialog | ビルド時に全枚 `getImage()` | **カードの `<img>` から URL を DOM 参照** |
| OGP | 原寸 JPG URL | **`getImage({ width: 1200, format: "webp" })`** |

AVIF は `Picture` コンポーネント専用であり、エンコードコストが WebP の数倍になる。必要になった場合は `generatePics/` での事前生成や、対象枚数を絞った段階的導入を検討する。

### 実装内容

#### 写真の配置

```
public/pics/ → src/assets/pics/   （.gitignore 対象）
```

#### `generatePics/`

- スキャン起点: `src/assets/pics/`
- `url`: `/src/assets/pics/{city}/{location}/{filename}`（Astro glob キーと一致）
- 拡張子: `.jpg` / `.JPG` / `.jpeg` / `.JPEG` に対応

#### 共有モジュール

- `src/lib/images.ts` — `import.meta.glob` + `loadImage(assetPath)`
- `src/lib/image-config.ts` — `GALLERY_WIDTHS` / `DETAIL_WIDTHS` / `OGP_WIDTH`

#### ページ・コンポーネント

- `PhotoCard.astro` — `<Image widths={[800, 1200]} sizes="..." />`
- `[city]/photo/[...filename].astro` — `<Image widths={[1200, 1920]} />` + OGP用 `getImage`
- `[city].astro` — 都市 OGP に `getImage`（代表写真 1 枚のみ）
- `PhotoDialog.ts` — `getImageSrcFromDom()` でギャラリーカードの最適化 URL を再利用

### データフロー

```
src/assets/pics/*.jpg
    ↓ generatePics
public/pics.json  (url: /src/assets/pics/...)
    ↓ astro build
dist/_astro/*.webp  + HTML (srcset)
```

### 運用

```bash
# 写真追加後
cd generatePics && npm run generatePics
npm run build    # 初回は数分かかる場合あり。2 回目以降は .astro/ キャッシュで高速化
npm run deploy
```

新マシンでは `src/assets/pics/` を手元からコピーしてから上記を実行する。

### 注意事項

- **初回ビルド**は 118 枚 × 2 幅 ≒ 400 変換程度（WebP のみ）。AVIF 併用時より大幅に軽い
- **2 回目以降**は `.astro/` キャッシュで差分のみ（ローカル保持推奨、`gitignore` 済み）
- `dist/` サイズは変換後ファイル分増加するが、ユーザーへの転送量は削減される
- macOS の NFD ファイル名は本番で 500 になる。追加後は NFC 確認（`CLAUDE.md` 参照）
- `pics.json` の `url` は `/pics/...` ではなく `/src/assets/pics/...` 形式

### 変更ファイル（参考）

- `.gitignore` — `public/pics` → `src/assets/pics/`
- `generatePics/index.ts`, `public/pics.json`
- `src/lib/images.ts`, `src/lib/image-config.ts`（新規）
- `src/components/PhotoCard.astro`
- `src/pages/[city].astro`, `src/pages/[city]/photo/[...filename].astro`
- `src/components/PhotoDialog.ts`
- `@types/Photo.d.ts`

---

## 改善案 3: 動的 OGP 画像生成

**ステータス: 未着手**

### 概要

現在は最適化済み WebP（1200px）を OGP に使用している。Astro の API エンドポイント + `satori` で都市名・撮影情報をオーバーレイした OGP 画像をビルド時に静的生成する。

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

1. ~~改善案 1（LQIP）~~ — 完了
2. ~~改善案 2（WebP 最適化）~~ — 完了
3. **改善案 3（動的 OGP）** — 次の候補。SNS シェア時の見栄え改善。ビルドコストは改善案 2 の AVIF 版より管理しやすい想定
