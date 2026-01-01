import type { BlogEntry } from "../../../../../@types/Blog"

const developerPlatformInfo = {
	platformName: "developer.leaner.co.jp" as const,
	iconImage: "/yusuke/leaner-logo-icon.png",
}

export const developerEntries: BlogEntry[] = [
	{
		date: "2025-10-24",
		title: "マネージャーゼロでマネジメントする組織",
		url: "https://developer.leaner.co.jp/entry/20251024-manager-zero-organization",
		...developerPlatformInfo,
	},
	{
		date: "2025-05-23",
		title: "リーナーではプロダクトデザインもみんなでやっています",
		url: "https://developer.leaner.co.jp/entry/20250523-leaner-product-design",
		...developerPlatformInfo,
	},
	{
		date: "2025-02-10",
		title: "プロダクトをつくる役割はすべてがグラデーション",
		url: "https://developer.leaner.co.jp/entry/20250210-leaner-product",
		...developerPlatformInfo,
	},
	{
		date: "2024-09-27",
		title: "エンジニアが長く働ける会社とは",
		url: "https://developer.leaner.co.jp/entry/20240927-long-live-developers",
		...developerPlatformInfo,
	},
]

