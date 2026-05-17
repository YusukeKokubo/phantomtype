# Astro 移行計画

**ステータス: 完了（2026-05-18）**

Phase 1〜5 すべて実装済み。

## 背景

Hono + Cloudflare Workers 構成から Astro + Cloudflare へ移行した。
移行の目的：

- MD コンテンツをファイルを置くだけで追加できるようにする（Content Collections）
- 写真ギャラリーにインタラクティブな UI を追加しやすくする（Islands Architecture）
- ルーティングをファイルベースに整理する

## 非ゴール（この移行ではやらなかった）

- blog タブの RSS 自動取得（`note.ts` / `zenn.ts` / `developer.ts` の TS リスト維持）
- personal タブの Content Collections 化（TS 配列のまま維持）
- 写真ファイル自体の Astro `<Image />` 処理（Cloudflare Assets 直配信を維持）

---

## ✅ Phase 1: Astro 基盤構築

- `astro.config.mjs`：`output: 'static'`・`trailingSlash: 'never'`・`@astrojs/react`・`@tailwindcss/postcss`
- `src/layouts/BaseLayout.astro` を作成（`renderer.tsx` 相当）
- `src/middleware.ts` でトレイリングスラッシュ 301 を実装
- `wrangler.jsonc`：`assets.directory` を `./dist` に変更
- `biome.json`：includes を `src/**` + `generatePics/**` に修正
- `src/legacy/` に旧 Hono ページを退避
- `package.json` スクリプトを `astro dev` / `astro build` ベースに更新

---

## ✅ Phase 2: 写真ギャラリーページの移行

- `src/pages/index.astro` — ホームページ
- `src/pages/[city].astro` — 都市ギャラリーページ（`yusuke` を `getStaticPaths` から除外）
- `src/pages/[city]/photo/[...filename].astro` — 写真詳細・EXIF 表示（rest パラメータで拡張子付き対応）
- `src/pages/404.astro` — カスタム 404 ページ
- `src/pages/yusuke.astro` — タブ枠 + career コンテンツを静的 HTML として出力（JS なし、Phase 3 で Islands 化）
- 本番 URL を Astro に切り替え、Hono エントリを削除

---

## ✅ Phase 3: yusuke ページの移行（Islands 化）

- `hono/jsx` → React への変換（`class` → `className`・`Child` → `ReactNode` 等）
- `@astrojs/react` + `react` + `@types/react` を導入
- `yusuke.astro` に Islands を配線（`client:load`）
- `MarkdownViewer.tsx` の手書きパーサーを proper ライブラリに置き換え
- 自前クライアントバンドルの仕組みを削除

---

## ✅ Phase 4: Content Collections 導入

- `src/content/` に career・values コレクションを定義
- 既存の `career/*.md`・`values/values.md` をコレクションに移行
- `data.ts` を削除し、フロントマターでメタデータを管理
- `CareerContent.tsx`・`ValuesContent.tsx` がコレクションのデータを読む形に更新
- blog・personal タブは TS リストのまま維持

---

## ✅ Phase 5: 写真ギャラリーのインタラクティブ機能追加

- **View Transitions** 追加（Astro 組み込み）
- Lightbox・キーボードナビゲーションは未実施（随時追加可能）
