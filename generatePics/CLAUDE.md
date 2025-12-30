# CLAUDE.md

This file provides guidance for working with the photo data generation script in this directory.

## 概要

`public/pics/` 配下の画像をスキャンし、EXIF メタデータを抽出して `public/pics.json` を生成するスクリプトです。

## 使用方法

```bash
npm install  # 初回のみ
npm run generatePics
```

## 動作

1. `public/pics/` ディレクトリを再帰的にスキャン
2. すべての JPG ファイルを検出
3. 各画像から EXIF メタデータを抽出（カメラ、レンズ、撮影設定など）
4. `public/pics.json` に `City[]` 構造でデータを出力（`City -> Location[] -> Photo[]`）

## ディレクトリ構造

- `index.ts` - 写真データ生成スクリプト
- `package.json` - スクリプト専用の依存関係
- `tsconfig.json` - TypeScript 設定

## 注意事項

- このディレクトリは独立したプロジェクト（専用の `package.json` を持つ）です
- 新しい写真を追加した際は必ずこのスクリプトを実行してください
- 生成された `public/pics.json` はコミット対象です
