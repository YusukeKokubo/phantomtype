export function formatDate(date: string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}

export function formatDateRange(
  startDate: string,
  endDate?: string | "Now",
): string {
  const start = formatDate(startDate)
  if (!endDate || endDate === "Now") {
    return `${start} 〜 現在`
  }
  const end = formatDate(endDate)
  return `${start} 〜 ${end}`
}

export function formatYearMonth(date: string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return `${year}年${month}月`
}

/**
 * 日付文字列をDateオブジェクトに変換
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}

/**
 * 2つの日付間の期間をミリ秒で取得
 */
export function getDurationMs(startDate: string, endDate: string): number {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  return end.getTime() - start.getTime()
}

/**
 * 期間を年数と月数で計算
 */
export function calculateDuration(
  startDate: string,
  endDate: string,
): { years: number; months: number } {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  const years = end.getFullYear() - start.getFullYear()
  const months = end.getMonth() - start.getMonth()
  const totalMonths = years * 12 + months
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  }
}

/**
 * 期間を人間が読みやすい形式で表示
 */
export function formatDuration(
  startDate: string,
  endDate: string,
): string {
  const { years, months } = calculateDuration(startDate, endDate)
  if (years === 0 && months === 0) {
    return "1ヶ月未満"
  }
  if (years === 0) {
    return `${months}ヶ月`
  }
  if (months === 0) {
    return `${years}年`
  }
  return `${years}年${months}ヶ月`
}

/**
 * タイムライン全体の期間に対する相対位置（0-100%）を計算
 */
export function calculatePosition(
  date: string,
  timelineStart: string,
  timelineEnd: string,
): number {
  const dateMs = parseDate(date).getTime()
  const startMs = parseDate(timelineStart).getTime()
  const endMs = parseDate(timelineEnd).getTime()
  const totalDuration = endMs - startMs
  if (totalDuration === 0) return 0
  return ((dateMs - startMs) / totalDuration) * 100
}

/**
 * 日付から相対的な時間を計算（例: "1ヶ月前"）
 */
export function getRelativeTime(date: string): string {
  const now = new Date()
  const targetDate = parseDate(date)
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

