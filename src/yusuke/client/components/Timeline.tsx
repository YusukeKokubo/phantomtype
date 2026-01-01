import type { TimelineEntry } from "../../../../@types/About"
import { formatYearMonth } from "../content/utils"
import { Card } from "./Card"

// カードのレイアウト定数
const CARD_HEIGHT = 200 // カードの推定高さ
const CARD_MARGIN = 20 // カード間のマージン

// 色の型定義
export type ColorInfo = {
  hex: string
  isCustom: boolean
}

// 16進数形式の色かどうかを判定
function isHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

// 色を取得するヘルパー関数
function getColor(colorValue?: string): ColorInfo {
  if (colorValue && isHexColor(colorValue)) {
    return {
      hex: colorValue,
      isCustom: true,
    }
  }
  // フォールバック: デフォルトのグレー色
  return {
    hex: "#6B7280",
    isCustom: true,
  }
}

// 年月範囲をフォーマット（YYYY年MM月-YYYY年MM月 または YYYY年MM月-現在）
function formatYearRange(startDate: string, endDate?: string | "Now"): string {
  const start = formatYearMonth(startDate)
  if (!endDate || endDate === "Now") {
    return `${start}-現在`
  }
  const end = formatYearMonth(endDate)
  const startYear = new Date(startDate).getFullYear()
  const endYear = new Date(endDate).getFullYear()
  const startMonth = new Date(startDate).getMonth() + 1
  const endMonth = new Date(endDate).getMonth() + 1
  if (startYear === endYear && startMonth === endMonth) {
    return start
  }
  return `${start}-${end}`
}

// 所属期間バーコンポーネント
type EntryWithGridPos = Omit<TimelineEntry, "color"> & {
  startRow: number
  endRow: number
  rowSpan: number
  color: ColorInfo
}

interface PeriodBarProps {
  entry: EntryWithGridPos
}

function PeriodBar({ entry }: PeriodBarProps) {
  return (
    <div
      key={`bar-${entry.date}-${entry.title}`}
      class="bg-blue-400 w-2 z-0"
      style={`grid-column: 1 / 2; grid-row: ${entry.startRow} / ${
        entry.endRow + 1
      }; background-color: ${entry.color.hex}; justify-self: center;`}
    />
  )
}

interface TimelineProps {
  entries: TimelineEntry[]
  renderCard?: (
    entry: TimelineEntry,
    color: ColorInfo,
    yearRange: string
  ) => any
  cardSize?: "default" | "small"
}

export function Timeline({
  entries,
  renderCard,
  cardSize = "default",
}: TimelineProps) {
  // 現在の日付を取得（終了日がないエントリ用）
  const today: string = new Date().toISOString().split("T")[0]!

  // タイムライン全体の期間を計算
  const allDates: string[] = entries.flatMap((entry) => {
    const dates: string[] = [entry.date]
    if (entry.endDate) {
      // endDateが'Now'の場合は現在日を使用
      dates.push(entry.endDate === "Now" ? today : entry.endDate)
    } else {
      dates.push(today)
    }
    return dates
  })
  const sortedDates = allDates.sort((a, b) => a.localeCompare(b))
  const earliestDate = sortedDates[0]
  const latestDate = sortedDates[sortedDates.length - 1]

  if (!earliestDate || !latestDate) {
    return null
  }

  // エントリを年でグループ化
  // endDateがある場合はendDateの年、ない場合はdateの年でグループ化
  const entriesByYear = new Map<number, Array<TimelineEntry>>()

  entries.forEach((entry) => {
    // endDateがある場合はendDateの年、ない場合はdateの年を使用
    // endDateが'Now'の場合は現在年を使用
    const year = entry.endDate
      ? entry.endDate === "Now"
        ? new Date(today).getFullYear()
        : new Date(entry.endDate).getFullYear()
      : new Date(entry.date).getFullYear()

    if (!entriesByYear.has(year)) {
      entriesByYear.set(year, [])
    }
    entriesByYear.get(year)!.push(entry)
  })

  // 各年のエントリをソート
  // endDateがある場合はendDate順、ない場合はdate順でソート
  entriesByYear.forEach((yearEntries) => {
    yearEntries.sort((a, b) => {
      const aDate =
        a.endDate === "Now"
          ? today
          : a.endDate === undefined
          ? a.date
          : a.endDate
      const bDate =
        b.endDate === "Now"
          ? today
          : b.endDate === undefined
          ? b.date
          : b.endDate
      return aDate.localeCompare(bDate)
    })
  })

  // 全ての年を取得してソート（新しい順）
  const currentYear = new Date().getFullYear()
  const allYearsSet = new Set(Array.from(entriesByYear.keys()))
  allYearsSet.add(currentYear) // 現在年を追加
  const allYears = Array.from(allYearsSet).sort((a, b) => b - a)

  // CSS Grid 用の行数を計算（月単位で行を作成）
  // earliestDate を年の最初（1月1日）に調整
  const earliestYear = new Date(earliestDate).getFullYear()
  const startDate = new Date(`${earliestYear}-01-01`)
  const endDate = new Date(latestDate)
  const monthsDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1
  const gridRows = Math.max(12, monthsDiff) // 最低12行

  // 各エントリのグリッド行位置を計算（新しいものが上に来るように反転）
  const entriesWithGridPos = entries.map((entry) => {
    const entryStart = new Date(entry.date)
    // endDateがない場合（ブログポストなど）は、entry.dateと同じ位置に表示する
    // endDateが'Now'の場合は現在日を使用
    const entryEnd = entry.endDate
      ? entry.endDate === "Now"
        ? new Date(today)
        : new Date(entry.endDate)
      : entryStart
    const startRowRaw =
      (entryStart.getFullYear() - startDate.getFullYear()) * 12 +
      (entryStart.getMonth() - startDate.getMonth()) +
      1
    const endRowRaw =
      (entryEnd.getFullYear() - startDate.getFullYear()) * 12 +
      (entryEnd.getMonth() - startDate.getMonth()) +
      1
    // 行番号を反転（新しいものが上に来るように）
    // endDateがない場合は、startRowとendRowは同じ値になる
    const startRow = gridRows - startRowRaw + 1
    const endRow = gridRows - endRowRaw + 1
    const rowSpan = Math.max(1, endRow - startRow + 1)
    const color = getColor(entry.color)

    return {
      ...entry,
      startRow,
      endRow,
      rowSpan,
      color,
    }
  })

  // 各年のグリッド行位置を計算（新しいものが上に来るように反転）
  const yearsWithGridPos = allYears.map((year) => {
    // 現在年は一番上（行1）に表示
    if (year === currentYear) {
      return { year, row: 1 }
    }
    const yearStart = new Date(`${year}-01-01`)
    const rowRaw =
      (yearStart.getFullYear() - startDate.getFullYear()) * 12 +
      (yearStart.getMonth() - startDate.getMonth()) +
      1
    // 行番号を反転（新しいものが上に来るように）
    const row = gridRows - rowRaw + 1
    return { year, row }
  })

  // タイムライン全体の高さを1200px程度に収める
  const targetTotalHeight = 1200 // 目標の全体の高さ
  const bottomPadding = 200 // タイムライン下部の余白
  const timelineHeight = targetTotalHeight - bottomPadding // タイムライン部分の高さ
  const rowHeight = Math.max(2, timelineHeight / gridRows) // 行の高さを動的に計算（最小2px）

  // デフォルトのカード表示関数
  const defaultRenderCard = (
    entry: TimelineEntry,
    color: ColorInfo,
    yearRange: string
  ) => {
    return <Card entry={entry} color={color} yearRange={yearRange} />
  }

  const cardRenderer = renderCard || defaultRenderCard

  const periodBars = entriesWithGridPos
    .filter((entry) => entry.endDate !== undefined)
    .map((entry) => (
      <PeriodBar key={`bar-${entry.date}-${entry.title}`} entry={entry} />
    ))

  return (
    <div class="py-8 px-4">
      <div
        class="mx-auto max-w-5xl"
        style={`display: grid; grid-template-columns: auto 1fr; grid-template-rows: repeat(${gridRows}, ${rowHeight}px); gap: 0;`}
      >
        {/* タイムライン（左側） */}
        <div
          class="bg-blue-400 w-0.5 hidden md:block"
          style={`grid-column: 1 / 2; grid-row: 1 / ${
            gridRows + 1
          }; justify-self: center;`}
        />
        {/* モバイル用のタイムライン */}
        <div
          class="bg-blue-400 w-px md:hidden"
          style={`grid-column: 1 / 2; grid-row: 1 / ${
            gridRows + 1
          }; justify-self: center;`}
        />

        {/* 所属期間バー（showPeriodBarsがtrueかつendDateがある場合のみ表示） */}
        {periodBars.length > 0 && periodBars}

        {/* 年ノードとエントリカード */}
        {yearsWithGridPos.map(({ year, row }) => {
          const yearEntries = entriesByYear.get(year) || []

          return (
            <div key={year} class="contents">
              {/* 年ノード（左側） */}
              <div
                class="z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-2 md:border-4 border-blue-400 flex items-center justify-center shadow-md"
                style={`grid-column: 1 / 2; grid-row: ${row}; justify-self: center; align-self: center;`}
              >
                <span class="text-sm md:text-lg font-semibold text-gray-700">
                  {year}
                </span>
              </div>

              {/* エントリカード（すべて右側に配置、同じ年のエントリは縦方向に配置） */}
              {yearEntries.map((entry, entryIndex) => {
                const entryWithPos = entriesWithGridPos.find(
                  (e) => e.date === entry.date && e.title === entry.title
                )!
                const color = getColor(entry.color)
                const yearRange = formatYearRange(entry.date, entry.endDate)
                const hasColor = !!entry.color

                // endDateがある場合はendRow、ない場合はstartRowを使用
                // endDateが'Now'の場合はendRowを使用（現在位置に表示）
                const cardRow = entry.endDate
                  ? entryWithPos.endRow
                  : entryWithPos.startRow

                // 同じ年のエントリを縦方向に配置するためのオフセット
                const verticalOffset = entryIndex * (CARD_HEIGHT + CARD_MARGIN)
                const baseOffset =
                  ((yearEntries.length - 1) * (CARD_HEIGHT + CARD_MARGIN)) / 2
                const topOffset = verticalOffset - baseOffset

                const cardContent = cardRenderer(entry, color, yearRange)

                // カードサイズに応じたクラスを決定
                const cardWrapperClass =
                  cardSize === "small"
                    ? "w-full max-w-[280px] sm:w-64 sm:max-w-none md:w-80 lg:w-96 ml-4 sm:ml-8"
                    : "w-full max-w-[280px] sm:w-64 sm:max-w-none md:w-80 lg:w-96 ml-4 sm:ml-8"
                const cardPaddingClass =
                  cardSize === "small"
                    ? "p-1.5 sm:p-2 md:p-2.5"
                    : "p-2 sm:p-3 md:p-4"

                return (
                  <div
                    key={`${year}-${entryIndex}`}
                    class={cardWrapperClass}
                    style={`grid-column: 2 / 3; grid-row: ${cardRow}; justify-self: start; margin-top: ${topOffset}px;`}
                  >
                    {/* カード */}
                    <div
                      class={`bg-white rounded shadow-md ${cardPaddingClass} hover:shadow-lg transition-shadow relative ${
                        hasColor ? "border-t-6" : ""
                      }`}
                      style={
                        hasColor
                          ? `border-top-color: ${color.hex}; border-top-width: 8px;`
                          : ""
                      }
                    >
                      {cardContent}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
