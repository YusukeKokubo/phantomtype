export function formatYearMonth(date: string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return `${year}年${month}月`
}

/**
 * 日付から相対的な時間を計算（例: "1ヶ月前"）
 */
export function getRelativeTime(date: string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffMs = now.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffDays < 1) {
    return "今日"
  }
  if (diffDays < 7) {
    return `${diffDays}日前`
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}週間前`
  }
  if (diffMonths < 12) {
    return `${diffMonths}ヶ月前`
  }
  return `${diffYears}年前`
}
