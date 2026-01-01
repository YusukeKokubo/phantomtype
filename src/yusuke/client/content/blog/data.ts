import type { BlogEntry } from "../../../../../@types/Blog"
import { noteEntries } from "./note"
import { zennEntries } from "./zenn"
import { developerEntries } from "./developer"

// 3つのソースをマージして最新日付順にソート
export const blogEntries: BlogEntry[] = [
	...noteEntries,
	...zennEntries,
	...developerEntries,
].sort((a, b) => b.date.localeCompare(a.date))

