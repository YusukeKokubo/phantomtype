# CLAUDE.md

This file provides guidance for working with the photo data generation script in this directory.

## 概要

`src/assets/pics/` 配下の画像をスキャンし、EXIF メタデータを抽出して `public/pics.json` を生成するスクリプトです。

## 使用方法

```bash
npm install  # 初回のみ
npm run generatePics
```

## 動作

1. `src/assets/pics/` ディレクトリを再帰的にスキャン
2. すべての JPG ファイルを検出
3. 各画像から EXIF メタデータを抽出（カメラ、レンズ、撮影設定など）
4. `public/pics.json` に `City[]` 構造でデータを出力（`City -> Location[] -> Photo[]`）

## ディレクトリ構造

独立した Node.js プロジェクト（専用の `package.json` を持つ）。メインロジックは `index.ts` 1ファイル。

## 注意事項

- 新しい写真を追加した際は必ずこのスクリプトを実行してください
- 生成される `public/pics.json`（親ディレクトリの `public/`）はコミット対象です
- `pics.json` の `url` は Astro glob キー形式（`/src/assets/pics/...`）で出力されます
