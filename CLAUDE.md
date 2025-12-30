# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Hono + Cloudflare Worker + Vite で構築された日本の写真ギャラリーサイト。都市ごとに整理された写真を動的に表示します。

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド（Tailwind CSS + Vite）
npm run build:css    # Tailwind CSSのみ
npm run preview      # ビルド後のプレビュー
npm run lint         # Lintチェック
npm run lint:fix     # Lint自動修正
npm run deploy       # Cloudflare Workerへデプロイ
npm run cf-typegen   # Cloudflare Bindings型定義生成
```

### 写真データの生成

`generatePics/` ディレクトリのスクリプトを使用します。詳細は `generatePics/CLAUDE.md` を参照してください。

## アーキテクチャ

### ディレクトリ構造

- `src/` - Hono アプリケーション
  - `index.tsx` - エントリーポイント
  - `renderer.tsx` - HTML レイアウト、メタデータ生成
  - `pages/` - ページコンポーネント（`home.tsx`, `city.tsx`, `photo.tsx`）
  - `components/` - 共通コンポーネント（`Nav.tsx`）
  - `styles/` - スタイル定義（`input.css`）
- `@types/` - TypeScript 型定義（`Photo.d.ts`, `hono.d.ts`）
- `public/` - 静的アセット
  - `pics/` - 写真ファイル（都市/ロケーション/ファイル名の階層構造）
  - `pics.json` - 自動生成される写真メタデータ（コミット対象）
  - `styles.css` - ビルドされた Tailwind CSS（gitignore 対象）
- `generatePics/` - 写真データ生成スクリプト（独立したプロジェクト、詳細は `generatePics/CLAUDE.md` を参照）
- `vite.config.ts` - Vite 設定ファイル
- `wrangler.jsonc` - Wrangler 設定ファイル

### ルーティング構造

- `GET /` - ホームページ（都市選択画面）
- `GET /:city` - 都市ごとの写真ギャラリーページ
- `GET /:city/photo/:filename` - 個別写真ページ（EXIF 情報表示）
- `GET /pics/*` - 静的ファイル配信（写真画像）
- `GET /*.{svg,jpg,css}` - 静的ファイル配信（その他のアセット）

ルーティングの順序が重要です。写真詳細ページ（`/:city/photo/:filename`）は都市ページ（`/:city`）より前に定義する必要があります。これにより、`/kyoto/photo/image.jpg` のようなリクエストが正しく処理されます。

### データフロー

1. 写真ファイルを `public/pics/[city]/[location]/[filename].jpg` に配置
2. `generatePics/` スクリプトで `public/pics.json` を生成（詳細は `generatePics/CLAUDE.md` を参照）
3. Hono ページコンポーネントは `pics.json` を静的インポートして表示
4. `npm run build` で Vite ビルドを実行し、Worker 用のバンドルを生成

### 技術的詳細

- **Hono JSX**: React ではなく Hono の軽量 JSX を使用（`class` 属性を使用）
- **日本語ファイル名対応**: 日本語のファイル名やディレクトリ名が使用可能
- **EXIF 自動抽出**: カメラ、レンズ、撮影設定などのメタデータを自動抽出
- **動的 OGP**: 都市ごとに適切な OGP 画像を設定
- **vite-ssr-components**: Vite と Hono の統合、ホットリロード対応
- **Cloudflare Worker + Assets**: エッジで動的にリクエストを処理し、静的ファイルも配信

### コードスタイル

- **インデント**: スペース 2 個
- **セミコロン**: 必要最小限(asNeeded)
- **フォーマッター**: Biome
- **型チェック**: strict モード、strictNullChecks 有効
- `noNonNullAssertion` ルールは無効化されている(EXIF 処理で `!` 演算子を使用するため)
