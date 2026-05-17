# Astro 移行計画

## 背景

現状の Hono + Cloudflare Workers 構成から Astro + Cloudflare へ移行する。
写真とテキストコンテンツ中心のサイトとして、以下を実現したい。

- MD コンテンツをファイルを置くだけで追加できるようにする（Content Collections）
- 写真ギャラリーにインタラクティブな UI を追加しやすくする（Islands Architecture）
- ルーティングをファイルベースに整理する

各フェーズは単体でデプロイ可能な状態を保ち、後のフェーズが不要になっても無駄にならない設計にする。

## 非ゴール（この移行ではやらない）

- blog タブの RSS 自動取得（`note.ts` / `zenn.ts` / `developer.ts` の TS リスト維持）
- personal タブの Content Collections 化（TS 配列のまま維持）
- 写真ファイル自体の Astro `<Image />` 処理（Cloudflare Assets 直配信を維持）

---

## Phase 1: Astro 基盤構築

**目標**: Astro プロジェクトをセットアップしてデプロイできる状態にする（ページ内容はまだ移行しない）

### やること

- `@astrojs/cloudflare` adapter を使った Astro プロジェクトをセットアップ
- Tailwind CSS の設定を移植（`@astrojs/tailwind` vs Vite プラグイン継続の方針を先に決める）
- `@types/` の型定義・ユーティリティ（`calcSize` 等）を移植
- 旧 `src/pages/` を `src/legacy/` に退避（Astro の `src/pages/*.astro` と名前空間が衝突するため）
- `astro.config` で `trailingSlash: 'never'` を設定
- `wrangler.jsonc` を Astro 向けに更新
- `biome.json` の includes を Astro ファイルに対応させる
- 削除対象の整理: `vite-ssr-components`・`vite-plugin-dev-static`・`vite-plugin-tailwind-watch`・`vite-plugin-client-manifest`

### 完了条件

- `npm run build` が通る
- Cloudflare へデプロイできる（ブランチプレビューで確認）
- Tailwind・型定義・wrangler vars（`PUBLIC_HOST` 等）が動作する

### 備考

SSG モード（全ページ静的生成）で進める。写真追加のたびにビルド＆デプロイするフローは現状と同じなので問題ない。

---

## Phase 2: 写真ギャラリーページの移行

**目標**: サイトのメインコンテンツである写真ギャラリーを Astro で表示し、本番 URL を切り替える

### やること

- `src/pages/index.astro` — ホームページ（都市選択）
- `src/pages/[city].astro` — 都市ギャラリーページ（`yusuke` を拾わないよう注意）
- `src/pages/[city]/photo/[filename].astro` — 写真詳細・EXIF 表示ページ
- `getStaticPaths()` で `pics.json` から全都市・全写真のパスを生成
- ヘッダー・ナビなど共通コンポーネントを Astro コンポーネントに移植
- OGP / メタデータ生成を Astro の `<head>` 管理に移植（`PUBLIC_HOST` は `import.meta.env` から取得）
- `src/pages/yusuke.astro` — **静的シェルのみ先行実装**（タブ・モーダル等のインタラクティブ機能は Phase 3 で Islands 化）

### 完了条件

- ギャラリー全ページ（`/`・`/:city`・`/:city/photo/:filename`）は現状と同等の表示・動作になる
- `/yusuke` は静的シェルが配信されること（タブ等のインタラクティブ機能は Phase 3）
- 回帰チェック（下記）をクリアしたら本番 URL を Astro に切り替える

### 回帰チェックリスト

- [ ] 全都市・代表写真の URL（日本語ファイル名含む・`encodeURIComponent` の挙動）
- [ ] トレイリングスラッシュの 301 リダイレクト
- [ ] OGP タグ（都市ページ・写真詳細ページ）
- [ ] NFC ファイル名チェック（`public/pics/` 以下に NFD 名がないか）
- [ ] `/yusuke` が `[city]` ルートに吸われないこと
- [ ] `/yusuke` が 404 にならず静的シェルが配信されること
- [ ] 存在しない都市へのアクセスで 404 になること

### 備考

Phase 2 完了後に `src/index.tsx`（Hono エントリ）と旧 vite プラグイン群を削除し、`CLAUDE.md` を更新する。`/yusuke` はこの時点で静的シェルのみ配信され、インタラクティブ機能は Phase 3 で追加する。ロールバックが必要な場合は旧 Hono ブランチを保持しておく。写真追加手順（`generatePics` → `pics.json` → ビルド → デプロイ）は現状維持。

---

## Phase 3: yusuke ページの移行（Islands 化）

**目標**: `src/yusuke/` の自前クライアントバンドル構成を Astro Islands に置き換える

### サブフェーズ 3a: React 化

現状のクライアントコードはすべて `hono/jsx` で書かれており、Astro Islands はそのまま使えない。事前に React に書き換える。

- `@astrojs/react` を導入
- `hono/jsx` → React への変換（`import` 元の変更・`Child` → `ReactNode` 等の型調整）
- `yusuke-client.tsx` の `hydrateRoot`（Hono 用）を削除

### サブフェーズ 3b: Astro Islands 配線

- `src/pages/yusuke.astro` を作成
- Islands の粒度を設計（タブ全体を 1 Island にするか、Modal だけ分離するか）
- `client:load` / `client:visible` を使ってインタラクティブ部分のみクライアント JS を有効化
- `MarkdownViewer.tsx` の手書きパーサーを `marked` または `unified/remark` に置き換え
- `vite-plugin-client-manifest.ts` など yusuke 専用の Vite プラグインを削除

### 完了条件

- yusuke ページが現状と同等の動作になる（タブ切り替え・モーダル・MD 表示）
- 自前クライアントバンドルの仕組みが不要になる

---

## Phase 4: Content Collections 導入

**目標**: career と values の MD ファイルを置くだけでコンテンツが追加できるようにする

対象は **career と values のみ**（blog・personal は非ゴール参照）。

### やること

- `src/content/` に career・values コレクションを定義
- フロントマタースキーマの設計（career: `date`, `endDate`, `title`, `company`, `image`, `color` 等）
- 既存の `career/*.md`・`values/values.md` をコレクションに移行
- フロントマターにメタデータを移動し、career / values の `data.ts` を削除
- `CareerContent.tsx`・`ValuesContent.tsx` がコレクションのデータを読む形に更新

### 完了条件

- 新しい career / values の `.md` ファイルをコレクションに追加するだけでコンテンツが反映される
- career と values の `data.ts` への手動追記が不要になる
- blog・personal タブは現状の TS リストのまま維持

---

## Phase 5: 写真ギャラリーのインタラクティブ機能追加

**目標**: Islands Architecture を活かしてリッチな表示を追加する

### 候補（優先度順）

1. **View Transitions** — ページ遷移をスムーズなアニメーションに（Astro 組み込み）
2. **Lightbox** — 写真クリックで別ページ遷移ではなくモーダル表示
3. **キーボードナビゲーション** — 写真間を矢印キーで移動

### 備考

Phase 2 が完了していれば随時追加できる。View Transitions と Lightbox（別 DOM・履歴操作）は設計がぶつかりやすいため、併用する場合は実装前に優先順位とフォールバック挙動を決める。

---

## 移行中の運用

- 各フェーズは独立したブランチで作業し、Cloudflare のプレビューデプロイで確認してから main にマージ
- Phase 1〜2 完了時点でメイン URL を Astro に切り替え、以降は Hono 構成を削除
- ロールバックが必要な場合は旧 Hono ブランチを保持しておく
