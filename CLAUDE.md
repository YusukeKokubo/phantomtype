# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは、Hono + Cloudflare Worker で構築された日本の写真ギャラリーサイトです。
Vite + Cloudflare Worker により、動的に都市ごとに整理された写真を表示します。

## 開発コマンド

### 開発サーバーの起動

```bash
# Vite開発サーバーを起動（ホットリロード対応）
npm run dev
```

### ビルド

```bash
# Tailwind CSS + Viteビルド
npm run build

# 個別実行も可能
npm run build:css  # Tailwind CSSのみ
```

### プレビュー

```bash
# ビルド後にローカルでプレビュー
npm run preview
```

### Lint とフォーマット

```bash
# Lintチェック
npm run lint

# Lint自動修正(unsafeな変更を含む)
npm run lint:fix
```

### 写真データの生成

```bash
cd scripts
npm install  # 初回のみ
npm run generatePics
cd ..
```

このコマンドは `public/pics/` ディレクトリ配下の画像ファイルをスキャンし、EXIF メタデータを抽出して `public/pics.json` を生成します。
新しい写真を追加した際は必ず実行してください。

**注意**: `scripts/` ディレクトリは独立したプロジェクトとして管理されています。専用の `package.json` を持っており、写真データ生成に必要な依存関係（exifreader、sharp など）が含まれています。

### Cloudflare Worker へのデプロイ

```bash
# 本番環境へデプロイ
npm run deploy
```

### 型定義の生成

```bash
# Cloudflare Bindingsの型定義を生成
npm run cf-typegen
```

## アーキテクチャ

### ディレクトリ構造

- `src/` - Hono アプリケーション

  - `index.tsx` - エントリーポイント、ルーティング定義
  - `renderer.tsx` - HTML レイアウト、メタデータ生成
  - `pages/` - ページコンポーネント
    - `home.tsx` - トップページ(都市選択画面)
    - `city.tsx` - 都市ごとの写真ギャラリーページ
    - `photo.tsx` - 個別写真ページ
  - `components/` - 共通コンポーネント
    - `Nav.tsx` - ナビゲーションコンポーネント(Header と Nav)
  - `styles/` - スタイル定義
    - `input.css` - Tailwind CSS 入力ファイル

- `@types/` - TypeScript 型定義

  - `Photo.d.ts` - Photo、City、Location、Exif 型の定義

- `public/` - 静的アセット

  - `pics/` - 写真ファイル(都市/ロケーション/ファイル名の階層構造)
  - `pics.json` - 自動生成される写真メタデータ(コミット対象)
  - `styles.css` - ビルドされた Tailwind CSS(gitignore 対象)

- `scripts/` - 写真データ生成スクリプト（独立したプロジェクト）

  - `package.json` - スクリプト専用の依存関係（exifreader、sharp など）
  - `tsconfig.json` - TypeScript 設定
  - `picsDataGenerator.ts` - 写真データ生成スクリプト

- `vite.config.ts` - Vite 設定ファイル（Cloudflare Worker 用）
- `wrangler.jsonc` - Wrangler 設定ファイル（Worker 設定、Assets 設定を含む）

- `.wrangler/` - Wrangler ビルド出力ディレクトリ(gitignore 対象)

### ルーティング構造

- `GET /` - ホームページ（都市選択画面）
- `GET /:city` - 都市ごとの写真ギャラリーページ
- `GET /:city/photo/:filename` - 個別写真ページ（EXIF 情報表示）
- `GET /pics/*` - 静的ファイル配信（写真画像）
- `GET /*.{svg,jpg,css}` - 静的ファイル配信（その他のアセット）

ルーティングの順序が重要です。写真詳細ページ（`/:city/photo/:filename`）は都市ページ（`/:city`）より前に定義する必要があります。これにより、`/kyoto/photo/image.jpg` のようなリクエストが正しく処理されます。

### データフロー

1. 写真ファイルは `public/pics/[city]/[location]/[filename].jpg` の形式で配置
2. `cd scripts && npm run generatePics` で `picsDataGenerator.ts` が実行される
3. スクリプトは全 JPG ファイルをスキャンし、exifreader で EXIF データを抽出
4. `public/pics.json` に以下の構造でデータを出力:
   ```
   City[] = [
     {
       city: string,
       locations: [
         {
           location: string,
           pics: [
             {
               filename: string,
               city: string,
               location: string,
               url: string,
               exif: Exif | null
             }
           ]
         }
       ]
     }
   ]
   ```
5. Hono ページコンポーネントは `pics.json` を静的インポートして表示
6. `npm run dev` で開発サーバーを起動し、動的にリクエストを処理
7. `npm run build` で Vite ビルドを実行し、Worker 用のバンドルを生成

### 重要な技術的詳細

- **日本語ファイル名対応**: 日本語のファイル名やディレクトリ名が使用可能
- **EXIF 自動抽出**: カメラ、レンズ、撮影設定などのメタデータを自動抽出
- **Vite**: 高速な開発サーバーとビルドツール
- **vite-ssr-components**: Vite と Hono の統合、ホットリロード対応
- **Hono JSX**: React ではなく Hono の軽量 JSX を使用
- **動的 OGP**: 都市ごとに適切な OGP 画像を設定
- **Tailwind CSS**: ユーティリティファーストのスタイリング
- **Biome**: JavaScript/TypeScript の lint/format ツール(ESLint と Prettier の代替)
- **Cloudflare Worker**: エッジで動的にリクエストを処理、高速なコンテンツ配信
- **Assets**: 静的ファイル（画像、CSS 等）を Worker と一緒に配信

### コードスタイル

- **インデント**: スペース 2 個
- **セミコロン**: 必要最小限(asNeeded)
- **フォーマッター**: Biome
- **型チェック**: strict モード、strictNullChecks 有効
- `noNonNullAssertion` ルールは無効化されている(EXIF 処理で `!` 演算子を使用するため)

## テスト

現在、自動テストは設定されていません。

## 画像の追加手順

1. `public/pics/[city]/[location]/` に JPG ファイルを配置
2. scripts ディレクトリで写真データを生成:
   ```bash
   cd scripts
   npm run generatePics
   cd ..
   ```
3. `npm run dev` で開発サーバーを起動し、動作確認
4. 変更をコミット(`pics.json` も含める)
5. `npm run deploy` でデプロイ
