# Astro 移行計画

## 背景

現状の Hono + Cloudflare Workers 構成から Astro + Cloudflare へ移行する。
写真とテキストコンテンツ中心のサイトとして、以下を実現したい。

- MD コンテンツをファイルを置くだけで追加できるようにする（Content Collections）
- 写真ギャラリーにインタラクティブな UI を追加しやすくする（Islands Architecture）
- ルーティングをファイルベースに整理する

各フェーズは単体でデプロイ可能な状態を保ち、後のフェーズが不要になっても無駄にならない設計にする。

---

## Phase 1: Astro 基盤構築

**目標**: 現行サイトと同等の内容が Astro で動作し、デプロイできる状態にする

### やること

- `@astrojs/cloudflare` adapter を使った Astro プロジェクトをセットアップ
- Tailwind CSS の設定を移植
- `@types/` の型定義・ユーティリティ（`calcSize` 等）を移植
- `public/pics/` と `public/pics.json` はそのまま再利用
- `wrangler.jsonc` を Astro 向けに更新（SSG モード）

### 完了条件

- `npm run build` が通る
- Cloudflare へデプロイできる（既存サイトと並行してブランチデプロイで確認）

### 備考

SSG モード（全ページ静的生成）で進める。写真追加のたびにビルド＆デプロイするフローは現状と同じなので問題ない。

---

## Phase 2: 写真ギャラリーページの移行

**目標**: サイトのメインコンテンツである写真ギャラリーを Astro で表示する

### やること

- `src/pages/index.astro` — ホームページ（都市選択）
- `src/pages/[city].astro` — 都市ギャラリーページ
- `src/pages/[city]/photo/[filename].astro` — 写真詳細・EXIF 表示ページ
- `getStaticPaths()` で `pics.json` から全都市・全写真のパスを生成
- ヘッダー・ナビなど共通コンポーネントを Astro コンポーネントに移植
- OGP / メタデータ生成を Astro の `<head>` 管理に移植

### 完了条件

- 全ページが現状と同等の表示・動作になる
- トレイリングスラッシュの正規化が動作する

### 備考

Hono JSX の `class` 属性は Astro では `class` のまま使えるので移植は機械的な作業が中心。

---

## Phase 3: yusuke ページの移行（Islands 化）

**目標**: `src/yusuke/` の自前クライアントバンドル構成を Astro Islands に置き換える

### やること

- `src/pages/yusuke.astro` を作成
- `src/yusuke/client/` の各コンポーネント（Tabs, Card, Timeline 等）をそのまま Islands として利用
- `MarkdownViewer.tsx` の手書きパーサーを `marked` か `unified/remark` に置き換え
- `vite-plugin-client-manifest.ts` など yusuke 専用の Vite プラグインを削除

### 完了条件

- yusuke ページが現状と同等の動作になる
- 自前クライアントバンドルの仕組みが不要になる

---

## Phase 4: Content Collections 導入

**目標**: MD ファイルを置くだけで yusuke コンテンツが追加できるようにする

### やること

- `src/content/` に career・values コレクションを定義
- 既存の `career/*.md`・`values/values.md` をコレクションに移行
- フロントマターにメタデータ（タイトル、日付、会社名等）を移動し `data.ts` を削除
- `CareerContent.tsx`・`ValuesContent.tsx` がコレクションのデータを読む形に更新

### 完了条件

- 新しい `.md` ファイルをコレクションに追加するだけでコンテンツが反映される
- `data.ts` への手動追記が不要になる

---

## Phase 5: 写真ギャラリーのインタラクティブ機能追加

**目標**: Islands Architecture を活かしてリッチな表示を追加する

### 候補（優先度順）

1. **View Transitions** — ページ遷移をスムーズなアニメーションに（Astro 組み込み）
2. **Lightbox** — 写真クリックで別ページ遷移ではなくモーダル表示
3. **キーボードナビゲーション** — 写真間を矢印キーで移動

### 備考

Phase 2 が完了していれば随時追加できる。一括実装でなく 1 つずつ追加してよい。

---

## 移行中の運用

- 各フェーズは独立したブランチで作業し、Cloudflare のプレビューデプロイで確認してから main にマージ
- Phase 1〜2 完了時点でメイン URL を Astro に切り替え、以降は Hono 構成を削除
