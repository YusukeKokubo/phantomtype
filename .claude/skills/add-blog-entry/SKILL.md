---
name: add-blog-entry
description: yusuke ページの blog タイムラインに内部メモ（Markdown）を追加するスキル。「メモを書きたい」「notes に追加したい」「ブログを書く」「記事を追加して」「今日のメモ」などのフレーズで積極的に使用すること。
---

# add-blog-entry

`src/content/notes/` に Markdown ファイルを作成し、yusuke ページの blog タブに表示されるメモを追加する。

## ファイルの作成

**保存先:** `src/content/notes/YYYY-MM-DD-slug.md`

slug のルール:
- 英数字とハイフンが基本（例: `team-culture`、`weekly-review`）
- ユーザーがタイトルを日本語で言った場合、英語に意訳してスラッグ化する
- 迷ったらタイトルから自然に導ける短い英語で

**テンプレート:**

```md
---
date: "YYYY-MM-DD"
title: "タイトル"
---

本文
```

## 動作フロー

1. ユーザーのメッセージからタイトルと本文を読み取る
2. 不足している情報があれば確認する（ただし date は今日の日付をデフォルトにする）
3. ファイルを作成する
4. 作成したファイルのパスと、閲覧できる URL（`/yusuke/notes/[slug]`）を伝える

`npm run build` は実行しない。
</thinking>
