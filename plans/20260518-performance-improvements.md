# パフォーマンス改善計画

**ステータス: 完了**

## 背景

写真サイトとしての読み込み速度を、ライブラリ追加なしで改善する。

## 施策一覧

| # | 内容 | 難度 | 効果 | ステータス |
|---|------|------|------|-----------|
| 1 | トップページのヒーロー画像を astro:assets で最適化 | ★☆☆ | 初期表示の転送量削減 | 完了 |
| 3 | Cloudflare `_headers` でキャッシュ強化 | ★☆☆ | 2回目以降のロード高速化 | 完了 |
| 4 | Google Fonts 削除（Inter は未使用） | ★☆☆ | 外部 DNS ルックアップ削減 | 完了 |

---

## 施策 1: トップページのヒーロー画像を最適化

### 問題

`index.astro` が `<img src="/kyoto.jpg">` で `public/kyoto.jpg` を直接参照している。
`public/` 配下のファイルは Astro の画像最適化を通らず、生の JPEG がそのまま配信される。

### 対応

1. `public/kyoto.jpg` → `src/assets/kyoto.jpg` に移動（`public/` には残さない）
2. `index.astro` で `<Image>` コンポーネントに差し替え

```astro
---
import { Image } from "astro:assets"
import heroImage from "../assets/kyoto.jpg"
---

<Image
  src={heroImage}
  alt=""
  widths={[800, 1200, 1920]}
  sizes="100vw"
  loading="eager"
  fetchpriority="high"
  class="object-cover w-full h-full"
/>
```

### 注意

- `ogkyoto.jpg`（OGP 用）は `public/` のまま残す（メタタグで URL 直接参照のため）
- ビルド後に `public/kyoto.jpg` を参照している箇所がないか確認（現状は `index.astro` のみ）

---

## 施策 3: Cloudflare `_headers` でキャッシュ強化

### 問題

Cloudflare Workers Assets のデフォルトキャッシュ TTL は短い。
Astro のビルド済みアセット（`/_astro/*.webp` 等）はハッシュ付きファイル名で内容変化がないのに長期キャッシュが効いていない。

### 対応

`public/_headers` ファイルを作成する（Cloudflare Pages / Workers Assets が `dist/_headers` として自動認識）。

```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/yusuke/*
  Cache-Control: public, max-age=86400

/*.svg
  Cache-Control: public, max-age=86400

/*.ico
  Cache-Control: public, max-age=86400
```

### 注意

- `pics.json` は更新される可能性があるので対象外（デフォルトキャッシュのまま）
- `_headers` ファイルは `public/` に置くと `dist/` にコピーされる
- Cloudflare Workers Assets が `_headers` を認識する仕様であることは確認要（Pages は対応済み、Workers Assets は `wrangler.jsonc` の `assets.headers` でも設定可能）

### 代替: wrangler.jsonc の assets.headers

Cloudflare Workers Assets が `_headers` を未サポートの場合は `wrangler.jsonc` に追記:

```jsonc
"assets": {
  "directory": "./dist",
  "headers": [
    {
      "source": "/_astro/*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 施策 4: Google Fonts を削除

### 問題

`BaseLayout.astro` が Inter を Google Fonts から読み込んでいる。

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet" />
```

しかし `src/styles/input.css` の `--font-body` は `Helvetica, "Noto Sans JP", sans-serif` であり、**Inter は実際には使われていない**。外部 DNS ルックアップが 2 件（`fonts.googleapis.com` + `fonts.gstatic.com`）発生しているだけで効果がない。

### 対応

`BaseLayout.astro` から上記 3 行を削除するだけ。フォントのフォールバックは `input.css` の `--font-body` で既に定義済みなので見た目への影響なし。

### 変更ファイル

- `src/layouts/BaseLayout.astro` — Google Fonts の `<link>` 3 行を削除

---

## 実施推奨順序

1. **施策 4**（最小変更、1 ファイル 3 行削除、リスクゼロ）
2. **施策 3**（ファイル 1 つ追加、デプロイ後に効果確認）
3. **施策 1**（画像移動 + コード変更、ビルド確認が必要）
