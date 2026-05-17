import type { TimelineEntry } from "../../../../@types/About"
import { formatYearMonth } from "../content/utils"
import { Card } from "./Card"

export type ColorInfo = {
  hex: string
  isCustom: boolean
}

function isHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

function getColor(colorValue?: string): ColorInfo {
  if (colorValue && isHexColor(colorValue)) {
    return { hex: colorValue, isCustom: true }
  }
  return { hex: "#6B7280", isCustom: true }
}

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
      className="bg-blue-400 w-2 z-0"
      style={{
        gridColumn: "1 / 2",
        gridRow: `${entry.startRow} / ${entry.endRow + 1}`,
        backgroundColor: entry.color.hex,
        justifySelf: "center",
      }}
    />
  )
}

interface TimelineProps {
  entries: TimelineEntry[]
  renderCard?: (entry: TimelineEntry, color: ColorInfo, yearRange: string) => React.ReactNode
  cardSize?: "default" | "small"
}

export function Timeline({
  entries,
  renderCard,
  cardSize = "default",
}: TimelineProps) {
  const today: string = new Date().toISOString().split("T")[0]!

  const allDates: string[] = entries.flatMap((entry) => {
    const dates: string[] = [entry.date]
    if (entry.endDate) {
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

  const entriesByYear = new Map<number, Array<TimelineEntry>>()

  entries.forEach((entry) => {
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

  entriesByYear.forEach((yearEntries) => {
    yearEntries.sort((a, b) => {
      const aDate =
        a.endDate === "Now" ? today : a.endDate === undefined ? a.date : a.endDate
      const bDate =
        b.endDate === "Now" ? today : b.endDate === undefined ? b.date : b.endDate
      return aDate.localeCompare(bDate)
    })
  })

  const currentYear = new Date().getFullYear()
  const allYearsSet = new Set(Array.from(entriesByYear.keys()))
  allYearsSet.add(currentYear)
  const allYears = Array.from(allYearsSet).sort((a, b) => b - a)

  const earliestYear = new Date(earliestDate).getFullYear()
  const startDate = new Date(`${earliestYear}-01-01`)
  const endDate = new Date(latestDate)
  const monthsDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1
  const gridRows = Math.max(12, monthsDiff)

  const entriesWithGridPos = entries.map((entry) => {
    const entryStart = new Date(entry.date)
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
    const startRow = gridRows - startRowRaw + 1
    const endRow = gridRows - endRowRaw + 1
    const rowSpan = Math.max(1, endRow - startRow + 1)
    const color = getColor(entry.color)
    return { ...entry, startRow, endRow, rowSpan, color }
  })

  const yearsWithGridPos = allYears.map((year) => {
    if (year === currentYear) {
      return { year, row: 1 }
    }
    const yearStart = new Date(`${year}-01-01`)
    const rowRaw =
      (yearStart.getFullYear() - startDate.getFullYear()) * 12 +
      (yearStart.getMonth() - startDate.getMonth()) +
      1
    const row = gridRows - rowRaw + 1
    return { year, row }
  })

  const targetTotalHeight = 1200
  const bottomPadding = 200
  const timelineHeight = targetTotalHeight - bottomPadding
  const rowHeight = Math.max(2, timelineHeight / gridRows)

  const defaultRenderCard = (
    entry: TimelineEntry,
    color: ColorInfo,
    yearRange: string,
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
    <div className="py-8 px-4">
      <div
        className="mx-auto max-w-5xl"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: `repeat(${gridRows}, ${rowHeight}px)`,
          gap: 0,
        }}
      >
        <div
          className="bg-blue-400 w-0.5 hidden md:block"
          style={{
            gridColumn: "1 / 2",
            gridRow: `1 / ${gridRows + 1}`,
            justifySelf: "center",
          }}
        />
        <div
          className="bg-blue-400 w-px md:hidden"
          style={{
            gridColumn: "1 / 2",
            gridRow: `1 / ${gridRows + 1}`,
            justifySelf: "center",
          }}
        />

        {periodBars.length > 0 && periodBars}

        {yearsWithGridPos.map(({ year, row }) => {
          const yearEntries = entriesByYear.get(year) || []

          return (
            <div key={year} className="contents">
              <div
                className="z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-2 md:border-4 border-blue-400 flex items-center justify-center shadow-md"
                style={{
                  gridColumn: "1 / 2",
                  gridRow: String(row),
                  justifySelf: "center",
                  alignSelf: "center",
                }}
              >
                <span className="text-sm md:text-lg font-semibold text-gray-700">
                  {year}
                </span>
              </div>

              {(() => {
                const entriesByRow = new Map<number, TimelineEntry[]>()
                for (const entry of yearEntries) {
                  const entryWithPos = entriesWithGridPos.find(
                    (e) => e.date === entry.date && e.title === entry.title,
                  )!
                  const cardRow = entry.endDate
                    ? entryWithPos.endRow
                    : entryWithPos.startRow
                  const rowEntries = entriesByRow.get(cardRow)
                  if (rowEntries) {
                    rowEntries.push(entry)
                  } else {
                    entriesByRow.set(cardRow, [entry])
                  }
                }

                const cardWrapperClass =
                  "w-full max-w-[280px] sm:w-64 sm:max-w-none md:w-80 lg:w-96 ml-4 sm:ml-8"
                const cardPaddingClass =
                  cardSize === "small"
                    ? "p-1.5 sm:p-2 md:p-2.5"
                    : "p-2 sm:p-3 md:p-4"

                return [...entriesByRow.entries()].map(
                  ([cardRow, rowEntries]) => (
                    <div
                      key={`${year}-${cardRow}`}
                      className={cardWrapperClass}
                      style={{
                        gridColumn: "2 / 3",
                        gridRow: String(cardRow),
                        justifySelf: "start",
                        alignSelf: "center",
                      }}
                    >
                      <div className="flex flex-col gap-5">
                        {rowEntries.map((entry) => {
                          const color = getColor(entry.color)
                          const yearRange = formatYearRange(
                            entry.date,
                            entry.endDate,
                          )
                          const hasColor = !!entry.color
                          const cardContent = cardRenderer(entry, color, yearRange)

                          return (
                            <div
                              key={`${entry.date}-${entry.title}`}
                              className={`bg-white rounded shadow-md ${cardPaddingClass} hover:shadow-lg transition-shadow relative ${
                                hasColor ? "border-t-6" : ""
                              }`}
                              style={
                                hasColor
                                  ? {
                                      borderTopColor: color.hex,
                                      borderTopWidth: "8px",
                                    }
                                  : {}
                              }
                            >
                              {cardContent}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ),
                )
              })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
