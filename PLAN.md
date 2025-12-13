# Next.js + Vercel → Hono + Cloudflare Pages 移行計画

## 移行概要

Next.js 15 (App Router) + Vercel から Hono + Cloudflare Pages への完全移行を実施します。

**ユーザーの選択:**
- プラットフォーム: Cloudflare Pages
- 画像配信: 静的配信のみ（最適化なし）
- レンダリング: SSG（ビルド時に静的HTML生成）
- React処理: Hono JSXで書き換え
- 画像移行: public/pics/ をそのまま使用

## 主要な技術スタック変更

### 削除
- Next.js 15
- React 19 / React DOM
- Vercel CLI
- next/image, next/link, next/font

### 追加
- Hono (Web Framework)
- Wrangler (Cloudflare Dev Tool)
- @cloudflare/workers-types

### 保持
- Tailwind CSS
- TypeScript
- Biome (Linter/Formatter)
- Sharp/ExifReader (データ生成用)

## 新しいプロジェクト構造

```
src/
├── index.tsx              # Honoアプリのエントリーポイント
├── renderer.tsx           # HTMLレイアウト（旧layout.tsx）
├── pages/
│   ├── home.tsx          # トップページ
│   └── city.tsx          # 都市ギャラリーページ
├── components/
│   └── Nav.tsx           # ナビゲーション（Hono JSX版）
└── styles/
    └── input.css         # Tailwind入力ファイル

scripts/
├── picsDataGenerator.ts  # 変更なし
└── build-ssg.ts          # 新規: SSG生成スクリプト

public/                   # 静的アセット（変更なし）
├── pics/
├── pics.json
└── ...

dist/                     # ビルド出力（新規）
wrangler.toml            # Cloudflare設定（新規）
```

## 実装手順

### ステップ1: 環境準備

**作業:**
1. 新ブランチ作成: `git checkout -b migrate-to-hono`
2. package.json更新
   - 削除: next, react, react-dom, vercel, eslint-config-next
   - 追加: hono@^4.6.14, wrangler@^3.97.0, @cloudflare/workers-types@^4.20241218.0
   - スクリプト更新
3. `npm install`実行
4. wrangler.toml作成

**変更ファイル:**
- `package.json`
- `wrangler.toml`（新規）

**package.json主要変更:**
```json
{
  "scripts": {
    "dev": "wrangler pages dev dist --live-reload",
    "build:css": "tailwindcss -i ./src/styles/input.css -o ./public/styles.css --minify",
    "build:ssg": "ts-node scripts/build-ssg.ts",
    "build": "npm run build:css && npm run build:ssg",
    "deploy": "npm run build && wrangler pages deploy dist"
  },
  "dependencies": {
    "hono": "^4.6.14"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241218.0",
    "wrangler": "^3.97.0",
    // 既存のdev依存関係を保持
  }
}
```

**wrangler.toml:**
```toml
name = "phantomtype"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

[env.production]
vars = { PUBLIC_HOST = "https://phantomtype.com" }
```

### ステップ2: TypeScript・Tailwind設定

**作業:**
1. tsconfig.json更新（jsx設定、module設定）
2. tailwind.config.js更新（contentパス変更）
3. src/styles/input.cssを作成

**変更ファイル:**
- `tsconfig.json`
- `tailwind.config.js`
- `src/styles/input.css`（新規）

**tsconfig.json主要変更:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "moduleResolution": "bundler",
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src/**/*", "@types/**/*", "scripts/**/*"]
}
```

**tailwind.config.js:**
```javascript
content: ['./src/**/*.{tsx,ts}']  // app/ から src/ へ
```

### ステップ3: Honoアプリの基本構造

**作業:**
1. src/renderer.tsx作成（HTMLレイアウト、メタデータ）
2. src/components/Nav.tsx作成（Hono JSX版）
3. src/index.tsx作成（ルーティング）

**新規ファイル:**
- `src/renderer.tsx`
- `src/components/Nav.tsx`
- `src/index.tsx`

**src/index.tsx概要:**
```tsx
import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'
import citiesData from '../public/pics.json'

const app = new Hono()

// 静的ファイル配信
app.use('/pics/*', serveStatic({ root: './' }))
app.use('/*.{svg,jpg,css}', serveStatic({ root: './public' }))

// トップページ
app.get('/', (c) => c.render(<HomePage cities={citiesData} />, {...metadata}))

// 都市ページ
app.get('/:city', (c) => {
  const city = c.req.param('city')
  const cityPics = cities.find(p => p.city === city)
  return c.render(<CityPage city={city} cityPics={cityPics} cities={cities} />, {...metadata})
})

export default app
```

**重要な変更:**
- Next.jsの`Link` → 通常の`<a>`タグ
- Next.jsの`Image` → 通常の`<img>`タグ
- `"use client"` → 削除（すべてサーバーサイド）
- `className` → `class`（Hono JSX）

### ステップ4: ページコンポーネント

**作業:**
1. src/pages/home.tsx作成（app/page.tsx移植）
2. src/pages/city.tsx作成（app/[city]/page.tsx移植）

**新規ファイル:**
- `src/pages/home.tsx`
- `src/pages/city.tsx`

**変更点:**
- `next/image`の`Image` → `<img>`（fill、priority属性削除）
- `next/link`の`Link` → `<a>`（scroll属性削除）
- `className` → `class`
- async Server Component → 通常の関数コンポーネント
- generateMetadata → rendererのpropsで処理

### ステップ5: SSGビルドスクリプト

**作業:**
1. scripts/build-ssg.ts作成
2. package.jsonのbuildスクリプト確認

**新規ファイル:**
- `scripts/build-ssg.ts`

**build-ssg.ts概要:**
```typescript
// pics.jsonから都市リストを取得
// 各都市ページ + トップページのHTMLを生成
// dist/ディレクトリに出力
// public/の内容をdist/にコピー
```

### ステップ6: ビルドとローカルテスト

**テスト手順:**
1. `npm run build:css` - Tailwind CSS生成
2. `npm run build:ssg` - SSG実行
3. `npm run dev` - Wrangler開発サーバー起動
4. http://localhost:8788/ で確認
5. 各都市ページ確認（/kyoto, /kanazawa等）

**確認項目:**
- 画像が正しく表示される
- ナビゲーションが動作する
- スタイルが正しく適用される
- 日本語ファイル名の画像が表示される
- メタデータ（OGP）が正しく設定される

### ステップ7: Cloudflare Pagesデプロイ

**作業:**
1. Cloudflare Pagesプロジェクト作成
2. GitHubリポジトリ接続
3. ビルド設定:
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `dist`
   - 環境変数: `PUBLIC_HOST=https://phantomtype.com`
4. デプロイ実行

### ステップ8: クリーンアップ

**作業:**
1. 旧Next.jsファイル削除
2. .gitignore更新
3. README.md更新
4. CLAUDE.md更新

**削除ファイル:**
- `app/`（ディレクトリ全体）
- `next.config.js`
- `next-env.d.ts`

**.gitignore追加:**
```
dist/
public/styles.css
```

## 重要ファイル一覧

### 新規作成が必要なファイル（優先度順）
1. `src/index.tsx` - エントリーポイント、全ルーティング定義
2. `src/renderer.tsx` - HTMLレイアウト、メタデータ生成
3. `scripts/build-ssg.ts` - SSG生成スクリプト
4. `src/pages/home.tsx` - トップページ
5. `src/pages/city.tsx` - 都市ページ
6. `src/components/Nav.tsx` - ナビゲーション
7. `wrangler.toml` - Cloudflare設定
8. `src/styles/input.css` - Tailwind入力

### 変更が必要なファイル
1. `package.json` - 依存関係、スクリプト
2. `tsconfig.json` - JSX設定
3. `tailwind.config.js` - contentパス
4. `.gitignore` - dist/, styles.css追加

### 保持するファイル（変更なし）
1. `scripts/picsDataGenerator.ts`
2. `@types/Photo.d.ts`
3. `public/pics/`（画像ディレクトリ）
4. `public/pics.json`
5. `biome.json`
6. `postcss.config.js`

## 注意事項

### 日本語ファイル名対応
- `public/pics.json`のURL構造を変更しない
- Cloudflare Pagesは日本語URLを正しく処理可能

### 環境変数
- `NEXT_PUBLIC_HOST` → `PUBLIC_HOST`に変更
- wrangler.tomlで定義
- Honoで`c.env?.PUBLIC_HOST`でアクセス

### 画像処理
- next/imageの最適化機能は使用しない
- 通常の`<img>`タグ（width、height属性は保持）
- 将来的にCloudflare Image Resizingを検討可能

### データ生成
- `npm run generatePics`は引き続き使用
- ビルド前に手動実行が必要
- Node.jsランタイムで実行（Cloudflare Workersではない）

### フォント
- Interフォントは Google Fonts CDN から読み込み
- renderer.tsxの`<head>`に`<link>`タグを追加

## 移行のメリット

1. **パフォーマンス**: Cloudflare Pagesのエッジ配信
2. **シンプル**: 依存関係の削減（React削除）
3. **コスト**: Cloudflare Pagesは無料枠が大きい
4. **保守性**: Honoのシンプルな構造
5. **互換性**: 既存のデータ構造をそのまま使用可能

## リスクと対策

### リスク1: SSGの複雑さ
**対策**: build-ssg.tsスクリプトで自動化

### リスク2: 画像最適化の欠如
**対策**: 将来的にCloudflare Image Resizingを追加可能

### リスク3: 開発体験の変化
**対策**: Wranglerの開発サーバーでホットリロード可能

## 実装時間の見積もり

- ステップ1-2: 環境準備とコンフィグ（30分）
- ステップ3-4: コンポーネント実装（2時間）
- ステップ5: SSGスクリプト（1時間）
- ステップ6: テストと調整（1時間）
- ステップ7: デプロイ（30分）
- ステップ8: クリーンアップ（30分）

**合計: 約5-6時間**

## 次のアクション

プラン承認後、ステップ1から順番に実装を開始します。各ステップ完了後にテストを行い、問題があれば調整します。
