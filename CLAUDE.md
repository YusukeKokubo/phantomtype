# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは、Hono + Cloudflare Pagesで構築された日本の写真ギャラリーサイトです。
SSG（静的サイト生成）により、都市ごとに整理された写真を表示します。

## 開発コマンド

### 開発サーバーの起動
```bash
# まずビルドを実行
npm run build

# Wrangler開発サーバーを起動
npm run dev
```

### ビルド
```bash
# Tailwind CSS + SSGビルド
npm run build

# 個別実行も可能
npm run build:css  # Tailwind CSSのみ
npm run build:ssg  # SSGのみ
```

### Lintとフォーマット
```bash
# Lintチェック
npm run lint

# Lint自動修正(unsafeな変更を含む)
npm run lint:fix
```

### 写真データの生成
```bash
npm run generatePics
```
このコマンドは `public/pics/` ディレクトリ配下の画像ファイルをスキャンし、EXIFメタデータを抽出して `public/pics.json` を生成します。
新しい写真を追加した際は必ず実行してください。

### Cloudflare Pagesへのデプロイ
```bash
# 本番環境へデプロイ
npm run deploy
```

## アーキテクチャ

### ディレクトリ構造

- `src/` - Honoアプリケーション
  - `index.tsx` - エントリーポイント、ルーティング定義
  - `renderer.tsx` - HTMLレイアウト、メタデータ生成
  - `pages/` - ページコンポーネント
    - `home.tsx` - トップページ(都市選択画面)
    - `city.tsx` - 都市ごとの写真ギャラリーページ
  - `components/` - 共通コンポーネント
    - `Nav.tsx` - ナビゲーションコンポーネント(HeaderとNav)
  - `styles/` - スタイル定義
    - `input.css` - Tailwind CSS入力ファイル

- `@types/` - TypeScript型定義
  - `Photo.d.ts` - Photo、City、Location、Exif型の定義

- `public/` - 静的アセット
  - `pics/` - 写真ファイル(都市/ロケーション/ファイル名の階層構造)
  - `pics.json` - 自動生成される写真メタデータ(コミット対象)
  - `styles.css` - ビルドされたTailwind CSS(gitignore対象)

- `scripts/` - ビルド/ユーティリティスクリプト
  - `picsDataGenerator.ts` - 写真データ生成スクリプト
  - `build-ssg.ts` - SSGビルドスクリプト

- `dist/` - SSGビルド出力ディレクトリ(gitignore対象)
  - 各都市のディレクトリとindex.html
  - publicディレクトリの内容がコピーされる

### データフロー

1. 写真ファイルは `public/pics/[city]/[location]/[filename].jpg` の形式で配置
2. `npm run generatePics` で `scripts/picsDataGenerator.ts` が実行される
3. スクリプトは全JPGファイルをスキャンし、exifreaderでEXIFデータを抽出
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
5. Honoページコンポーネントは `pics.json` を静的インポートして表示
6. `npm run build:ssg` でSSGビルドを実行し、各ページのHTMLを生成

### 重要な技術的詳細

- **日本語ファイル名対応**: 日本語のファイル名やディレクトリ名が使用可能
- **EXIF自動抽出**: カメラ、レンズ、撮影設定などのメタデータを自動抽出
- **SSG (Static Site Generation)**: ビルド時に全ページのHTMLを事前生成
- **Hono JSX**: ReactではなくHonoの軽量JSXを使用
- **動的OGP**: 都市ごとに適切なOGP画像を設定
- **Tailwind CSS**: ユーティリティファーストのスタイリング
- **Biome**: JavaScript/TypeScriptのlint/formatツール(ESLintとPrettierの代替)
- **Cloudflare Pages**: エッジ配信による高速なコンテンツ配信

### コードスタイル

- **インデント**: スペース2個
- **セミコロン**: 必要最小限(asNeeded)
- **フォーマッター**: Biome
- **型チェック**: strictモード、strictNullChecks有効
- `noNonNullAssertion` ルールは無効化されている(EXIF処理で `!` 演算子を使用するため)

## テスト

現在、自動テストは設定されていません。

## 画像の追加手順

1. `public/pics/[city]/[location]/` に JPG ファイルを配置
2. `npm run generatePics` を実行して `pics.json` を更新
3. `npm run build` でビルドを実行
4. `npm run dev` で動作確認
5. 変更をコミット(`pics.json` も含める)
6. `npm run deploy` でデプロイ
