# ブログタブ実装まとめ

## 実装概要

`http://localhost:5173/yusuke#blog` でブログポストをタイムライン形式で表示する機能を実装しました。

## 実装内容

### 1. 新規作成ファイル

#### `src/yusuke/client/content/blog/data.ts`

- ブログポストのデータを定義
- `TimelineEntry[]` 型でエントリを管理
- 現在はサンプルデータ（note.com、developer.leaner.co.jp の記事）
- 各エントリには `date`、`title`、`url`、`description`、`color` を含む
- `endDate` は設定していない（ブログポストは単一の公開日）

#### `src/yusuke/client/content/blog/BlogContent.tsx`

- ブログコンテンツを表示するコンポーネント
- `CareerContent.tsx` を参考に実装
- `Timeline` コンポーネントを使用
- `endDate` がない場合は `formatYearMonth(entry.date)` で単一の年月のみを表示

### 2. 更新ファイル

#### `src/yusuke/client/components/Tabs.tsx`

- `TabId` 型に `"blog"` を追加
- `tabs` 配列に `{ id: "blog", label: "blog" }` を追加
- `getTabFromHash()` 関数で `"blog"` を認識できるように更新

#### `src/yusuke/client/yusuke-tabs.tsx`

- `BlogContent` と `blogEntries` をインポート
- `switch` 文に `case "blog"` を追加

#### `src/yusuke/client/components/Timeline.tsx`

- 所属期間バーの表示条件を変更
- `endDate` があるエントリのみ期間バーを表示するように修正
- `entriesWithGridPos.filter((entry) => entry.endDate)` でフィルタリング

## 技術的詳細

### 日付表示の仕様

- **ブログポスト**: `endDate` がないため、「YYYY 年 MM 月」形式で単一の日付のみ表示
- **キャリア**: `endDate` があるため、「YYYY 年 MM 月-YYYY 年 MM 月」または「YYYY 年 MM 月-現在」形式で期間を表示

### 所属期間バーの表示

- `endDate` があるエントリのみ期間バーを表示
- ブログポストは `endDate` がないため、期間バーは表示されない

### データ構造

```typescript
interface TimelineEntry {
  date: string // ISO 8601 format (YYYY-MM-DD)
  endDate?: string // ブログポストには設定しない
  title: string
  description?: string
  url?: string
  image?: string
  detail?: string
  color?: string
}
```

## 現在の状態

### 正常に動作している機能

- ✅ ブログタブの表示
- ✅ タイムライン形式でのブログポスト表示
- ✅ 日付表示（単一の年月のみ）
- ✅ 所属期間バーの非表示
- ✅ URL ハッシュ `#blog` でのタブ切り替え

### データの状態

- `data.ts` にはサンプルデータが含まれている
- 公開日は仮の値（2023-01-01、2022-01-01 など）
- note.com の記事はすべて同じ URL（https://note.com/yusukeko）になっている

## 今後の作業

### 1. データの更新（優先度：高）

以下の 3 つのソースから正確な情報を収集して `data.ts` を更新する必要があります：

- **note.com/yusukeko**: https://note.com/yusukeko
- **zenn.dev/yusukek**: https://zenn.dev/yusukek
- **developer.leaner.co.jp**: https://developer.leaner.co.jp/archive/category/%E3%83%81%E3%83%BC%E3%83%A0

各記事について以下を正確に設定：

- `date`: 正確な公開日（ISO 8601 形式: YYYY-MM-DD）
- `url`: 個別の記事 URL（現在はすべて同じ URL になっている）
- `title`: 記事タイトル
- `description`: 記事の説明（オプション）

### 2. データの追加

- Zenn の記事を追加（現在はコメントのみ）
- その他のブログポストがあれば追加

## ファイル構成

```
src/yusuke/client/
├── components/
│   ├── Tabs.tsx (更新: blogタブを追加)
│   └── Timeline.tsx (更新: 期間バーの表示条件を変更)
├── content/
│   └── blog/
│       ├── data.ts (新規: ブログポストデータ)
│       └── BlogContent.tsx (新規: ブログコンテンツコンポーネント)
└── yusuke-tabs.tsx (更新: blogタブのケースを追加)
```

## 参考実装

既存の `career` タブの実装を参考にしています：

- `src/yusuke/client/content/career/CareerContent.tsx`
- `src/yusuke/client/content/career/data.ts`

主な違い：

- ブログポストは `endDate` がない
- 日付表示は単一の年月のみ
- 期間バーは表示されない

## 注意事項

- `Timeline` コンポーネントは `endDate` の有無で自動的に期間バーの表示を制御します
- `BlogContent` の `renderCard` 関数で `endDate` がない場合の日付表示を調整しています
- エラーハンドリングは `yusuke-tabs.tsx` から削除されています（ユーザーが修正済み）
