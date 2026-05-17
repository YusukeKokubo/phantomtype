# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Astro + Cloudflare Workers Assets で構築された日本の写真ギャラリーサイト。都市ごとに整理された写真を静的生成（SSG）で表示します。

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動（astro dev）
npm run build        # ビルド（astro build、dist/ に出力）
npm run preview      # ビルド後のプレビュー
npm run lint         # Lintチェック
npm run lint:fix     # Lint自動修正
npm run deploy       # ビルド → Cloudflare へデプロイ（wrangler deploy）
```

### 写真データの生成

`generatePics/` ディレクトリのスクリプトを使用します。詳細は `generatePics/CLAUDE.md` を参照してください。

## アーキテクチャ

### ディレクトリ構造

- `src/` - Astro アプリケーション
  - `pages/` - ファイルベースルーティング（`.astro` ファイル）
  - `layouts/` - 共通レイアウト（`BaseLayout.astro` が OGP・フォント・Tailwind を管理）
  - `components/` - 共通 Astro コンポーネント
  - `content/` - Content Collections（career / values の MD ファイル）
  - `content.config.ts` - コレクション定義（glob loader + Zod スキーマ）
  - `middleware.ts` - トレイリングスラッシュの 301 リダイレクト（dev のみ有効）
  - `styles/` - Tailwind CSS 入力ファイル（`input.css`）
  - `yusuke/` - Yusuke ページの React Island コンポーネント群
    - `client/` - React コンポーネント・コンテンツデータ
      - `YusukeApp.tsx` - Island のルートコンポーネント（props でデータ受け取り）
      - `content/career/` - キャリアの UI コンポーネント（`CareerContent.tsx`）
      - `content/values/` - バリューの UI コンポーネント（`ValuesContent.tsx`）
      - `content/personal/` - パーソナルのデータ・UI（TS 配列のまま）
      - `content/blog/` - ブログのデータ・UI（TS 配列のまま）
  - `legacy/` - 旧 Hono 実装の退避先（型チェック対象外）
- `@types/` - TypeScript 型定義
- `public/` - 静的アセット
  - `pics/` - 写真ファイル（都市/ロケーション/ファイル名の階層構造）
  - `pics.json` - 自動生成される写真メタデータ（コミット対象）
- `astro.config.mjs` - Astro 設定ファイル
- `wrangler.jsonc` - Wrangler 設定（`assets.directory: ./dist`）
- `generatePics/` - 写真データ生成スクリプト（独立したプロジェクト、詳細は `generatePics/CLAUDE.md` を参照）
- `plans/` - 設計・移行計画ドキュメント

### ルーティング構造

Astro のファイルベースルーティング（`src/pages/`）:

- `index.astro` → `/` — ホームページ（都市選択）
- `yusuke.astro` → `/yusuke` — About ページ（React Island）
- `[city].astro` → `/:city` — 都市ギャラリーページ（`getStaticPaths` で `pics.json` から生成）
- `[city]/photo/[...filename].astro` → `/:city/photo/:filename` — 写真詳細・EXIF ページ
- `404.astro` → カスタム 404

`[...filename]` の rest パラメータは `.jpg` 等の拡張子付きファイル名をマッチさせるため必要（`[filename]` では拡張子付きをマッチできない）。

### データフロー

1. 写真ファイルを `public/pics/[city]/[location]/[filename].jpg` に配置
2. `generatePics/` スクリプトで `public/pics.json` を生成（詳細は `generatePics/CLAUDE.md` を参照）
3. `[city].astro` / `[city]/photo/[...filename].astro` が `getStaticPaths()` 内で `pics.json` を読み込んでページを静的生成
4. `npm run build` で Astro ビルドを実行し、`dist/` に HTML + アセットを出力
5. `wrangler deploy` で Cloudflare Workers Assets にアップロード

**注意**: macOS は日本語ファイル名を NFD 形式で保存する場合がある。Cloudflare Workers Assets は NFC の URL でマッチングするため、NFD ファイル名は本番環境で 500 エラーになる。写真追加後はデプロイ前に NFC を確認: `python3 -c "import os,unicodedata; [print(n) for r,d,f in os.walk('public/pics') for n in d+f if n != unicodedata.normalize('NFC',n)]"` (出力なしなら OK)

### Content Collections（career / values）

`src/content/career/*.md` に MD ファイルを追加するだけで career タブに表示される。フロントマター:

```yaml
---
date: "YYYY-MM-DD"       # 開始日（必須）
endDate: "YYYY-MM-DD"    # 終了日（省略可、"Now" で現在）
title: "会社名"           # 表示タイトル（必須）
image: "/yusuke/xxx.webp" # ロゴ画像パス（省略可）
color: "#RRGGBB"          # カードのアクセントカラー（省略可）
---
本文（マークダウン）
```

values は `src/content/values/values.md` の本文がそのまま表示される（フロントマター不要）。

### Yusuke ページの Islands 構造

`yusuke.astro` が `getCollection()` でビルド時にデータを取得 → `<YusukeApp client:load ...>` に props として渡す。React コンポーネントはクライアント側でハイドレート。blog・personal タブは引き続き TS 配列のまま（Content Collections 化は非ゴール）。

### URL エンコーディング

- 画像 src（`<img src={...}>`）: `encodeURI()` — スペースを `%20` に変換、`/` はそのまま
- パス生成（`href={...}`）: `encodeURIComponent()` — `/` も含めてすべてエンコード（ただしセグメント単位で適用）

### 技術的詳細

- **Astro**: SSG（`output: 'static'`）、`trailingSlash: 'never'`、View Transitions 有効
- **React Islands**: `@astrojs/react`、インタラクティブ部分のみ `client:load`
- **Tailwind CSS v4**: `@tailwindcss/postcss` 経由（Vite 8 / Rolldown との互換性のため `@tailwindcss/vite` は不使用）
- **日本語ファイル名対応**: 日本語のファイル名やディレクトリ名が使用可能
- **EXIF 自動抽出**: `generatePics/` スクリプトが抽出し `pics.json` に保存

### コードスタイル

- **インデント**: スペース 2 個
- **セミコロン**: 必要最小限(asNeeded)
- **フォーマッター**: Biome
- **型チェック**: strict モード、strictNullChecks 有効
- `noNonNullAssertion` ルールは無効化されている（EXIF 処理で `!` 演算子を使用するため）
- **JSX**: Astro コンポーネントは `class=`、React コンポーネントは `className=`
