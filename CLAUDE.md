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

```bash
cd generatePics
npm install  # 初回のみ
npm run generatePics
cd ..
```

`public/pics/` 配下の画像をスキャンし、EXIF メタデータを抽出して `public/pics.json` を生成します。新しい写真を追加した際は必ず実行してください。

**注意**: `generatePics/` ディレクトリは独立したプロジェクト（専用の `package.json` を持つ）です。

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
- `generatePics/` - 写真データ生成スクリプト（独立したプロジェクト）
  - `index.ts` - 写真データ生成スクリプト
  - `package.json` - スクリプト専用の依存関係
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
2. `cd generatePics && npm run generatePics` で全 JPG ファイルをスキャンし、EXIF データを抽出
3. `public/pics.json` に `City[]` 構造でデータを出力（`City -> Location[] -> Photo[]`）
4. Hono ページコンポーネントは `pics.json` を静的インポートして表示
5. `npm run build` で Vite ビルドを実行し、Worker 用のバンドルを生成

### 重要な技術的詳細

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
- **テスト**: 現在、自動テストは設定されていません

## 画像の追加手順

1. `public/pics/[city]/[location]/` に JPG ファイルを配置
2. `cd generatePics && npm run generatePics` で写真データを生成
3. `npm run dev` で動作確認
4. 変更をコミット（`pics.json` も含める）
5. `npm run deploy` でデプロイ
