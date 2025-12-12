# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは、Next.js 15 (App Router) で構築された日本の写真ギャラリーサイトです。
Vercelでホストされており、都市ごとに整理された写真を表示します。

## 開発コマンド

### 開発サーバーの起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
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

### Vercelへのデプロイ
```bash
# 本番環境へデプロイ
npm run deploy

# 初回のみ必要: Vercelログイン
npm run vercel:login
```

## アーキテクチャ

### ディレクトリ構造

- `app/` - Next.js App Router のページとコンポーネント
  - `page.tsx` - トップページ(都市選択画面)
  - `[city]/page.tsx` - 都市ごとの写真ギャラリーページ(動的ルート)
  - `components/Nav.tsx` - ナビゲーションコンポーネント(HeaderとNav)
  - `layout.tsx` - ルートレイアウト
  - `globals.css` - グローバルスタイル

- `@types/` - TypeScript型定義
  - `Photo.d.ts` - Photo、City、Location、Exif型の定義

- `public/` - 静的アセット
  - `pics/` - 写真ファイル(都市/ロケーション/ファイル名の階層構造)
  - `pics.json` - 自動生成される写真メタデータ(コミット対象)

- `scripts/` - ビルド/ユーティリティスクリプト
  - `picsDataGenerator.ts` - 写真データ生成スクリプト

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
5. Next.jsページコンポーネントは `pics.json` を静的インポートして表示

### 重要な技術的詳細

- **日本語ファイル名対応**: 日本語のファイル名やディレクトリ名が使用可能
- **EXIF自動抽出**: カメラ、レンズ、撮影設定などのメタデータを自動抽出
- **レスポンシブ画像**: Next.js Imageコンポーネントで最適化された画像配信
- **動的OGP**: 都市ごとに適切なOGP画像を設定
- **Tailwind CSS**: ユーティリティファーストのスタイリング
- **Biome**: JavaScript/TypeScriptのlint/formatツール(ESLintとPrettierの代替)

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
3. `npm run dev` で動作確認
4. 変更をコミット(`pics.json` も含める)
5. `npm run deploy` でデプロイ
