export interface BlogEntry {
	date: string // ISO 8601 format (YYYY-MM-DD)
	title: string
	url: string
	platformName: "note.com" | "zenn.dev" | "developer.leaner.co.jp" // プラットフォーム名（例: "note.com", "zenn.dev"）
	iconImage: string // 画像アイコンの画像パス
}

