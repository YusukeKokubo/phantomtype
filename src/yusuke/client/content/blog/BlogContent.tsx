import type { BlogEntry } from "../../../../../@types/Blog"
import { Card } from "../../components/Card"
import { formatYearMonth, getRelativeTime } from "../utils"

export function BlogContent({ entries }: { entries: BlogEntry[] }) {
  if (entries.length === 0) {
    return <p class="text-text-secondary">コンテンツを追加してください</p>
  }

  // 最新順（日付の降順）にソート
  const sortedEntries = [...entries].sort((a, b) => {
    return b.date.localeCompare(a.date)
  })

  // 年ごとにグループ化
  const entriesByYear = sortedEntries.reduce((acc, entry) => {
    const year = entry.date.substring(0, 4) // YYYY-MM-DD から年を取得
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(entry)
    return acc
  }, {} as Record<string, BlogEntry[]>)

  // 年を降順でソート
  const years = Object.keys(entriesByYear).sort((a, b) => b.localeCompare(a))

  return (
    <div class="mx-auto max-w-3xl py-8 px-4 flex flex-col gap-8">
      {years.map((year) => (
        <div key={year}>
          {/* 年の見出し */}
          <h2 class="text-2xl font-bold text-gray-800 mb-6">{year}</h2>

          {/* その年のエントリリスト */}
          <div class="relative">
            {/* タイムラインの縦線 */}
            <div class="absolute left-4 top-0 bottom-0 w-0.5 border-l border-dashed border-gray-300"></div>

            <div class="space-y-8">
              {entriesByYear[year]!.map((entry) => {
                const displayDate = formatYearMonth(entry.date)
                const relativeTime = getRelativeTime(entry.date)

                return (
                  <div
                    key={`${entry.date}-${entry.title}`}
                    class="relative flex items-start gap-4"
                  >
                    {/* タイムラインのアイコン */}
                    <div class="relative z-10 shrink-0">
                      <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-white p-1.5">
                        <img
                          src={entry.iconImage}
                          alt={entry.platformName}
                          class="w-full h-full"
                        />
                      </div>
                    </div>

                    {/* コンテンツエリア */}
                    <div class="flex-1 min-w-0 pt-1">
                      {/* 説明テキスト */}
                      {entry.platformName && (
                        <div class="text-sm text-gray-600 mb-3">
                          <span>
                            <strong class="font-semibold">
                              {entry.platformName}
                            </strong>{" "}
                            に投稿しました {relativeTime}
                          </span>
                        </div>
                      )}

                      {/* カード */}
                      <div class="bg-white rounded shadow-md hover:shadow-lg transition-shadow max-w-md p-4">
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
