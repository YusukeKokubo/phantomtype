import type { BlogEntry } from "../../../../../@types/Blog"
import { Card } from "../../components/Card"
import { formatYearMonth, getRelativeTime } from "../utils"

export function BlogContent({ entries }: { entries: BlogEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-text-secondary">コンテンツを追加してください</p>
  }

  // 最新順（日付の降順）にソート
  const sortedEntries = [...entries].sort((a, b) => {
    return b.date.localeCompare(a.date)
  })

  // 年ごとにグループ化（表示順は配列で明示的に管理）
  const yearGroups = new Map<string, BlogEntry[]>()
  for (const entry of sortedEntries) {
    const year = entry.date.substring(0, 4) // YYYY-MM-DD から年を取得
    const group = yearGroups.get(year)
    if (group) {
      group.push(entry)
    } else {
      yearGroups.set(year, [entry])
    }
  }

  const entriesByYear = [...yearGroups.entries()]
    .map(([year, entries]) => ({ year, entries }))
    .sort((a, b) => b.year.localeCompare(a.year))

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 flex flex-col gap-8">
      {entriesByYear.map(({ year, entries }) => (
        <div key={year}>
          {/* 年の見出し */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{year}</h2>

          {/* その年のエントリリスト */}
          <div className="relative">
            {/* タイムラインの縦線 */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 border-l border-dashed border-gray-300"></div>

            <div className="space-y-8">
              {entries.map((entry) => {
                const displayDate = formatYearMonth(entry.date)
                const relativeTime = getRelativeTime(entry.date)

                return (
                  <div
                    key={`${entry.date}-${entry.title}`}
                    className="relative flex items-start gap-4"
                  >
                    {/* タイムラインのアイコン */}
                    <div className="relative z-10 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-white p-1.5">
                        <img
                          src={entry.iconImage}
                          alt={entry.platformName}
                          className="w-full h-full"
                        />
                      </div>
                    </div>

                    {/* コンテンツエリア */}
                    <div className="flex-1 min-w-0 pt-1">
                      {/* 説明テキスト */}
                      {entry.platformName && (
                        <div className="text-sm text-gray-600 mb-3">
                          <span>
                            <strong className="font-semibold">
                              {entry.platformName}
                            </strong>{" "}
                            に投稿しました {relativeTime}
                          </span>
                        </div>
                      )}

                      {/* カード */}
                      <div className="bg-white rounded shadow-md hover:shadow-lg transition-shadow max-w-md p-4">
                        <Card
                          entry={entry}
                          yearRange={displayDate}
                          imageStyle="default"
                          compact={false}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
