export interface TimelineEntry {
	date: string // ISO 8601 format (YYYY-MM-DD) - 開始日
	endDate?: string | "Now" // ISO 8601 format (YYYY-MM-DD) または "Now" - 終了日（オプション）
	title: string
	description?: string
	url?: string
	image?: string // 画像URL（相対パスまたは絶対URL）
	detail?: string // ポップアップで表示する詳細コンテンツ（HTML文字列）
	color?: string // 色の名前（"blue", "orange", "red", "purple", "green", "pink"）
}

export interface GalleryEntry {
	title: string
	description?: string
	url?: string
	image?: string // 画像URL（相対パスまたは絶対URL）
	detail?: string // ポップアップで表示する詳細コンテンツ（HTML文字列）
}

export interface AboutData {
	entries: TimelineEntry[]
	values?: string // 価値観のMarkdownコンテンツ
}

