import type { TimelineEntry } from "../../../../../@types/About"
import { Timeline, type ColorInfo } from "../../components/Timeline"
import { Card } from "../../components/Card"

export function CareerContent({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return <p class="text-text-secondary">コンテンツを追加してください</p>
  }

  // カード表示用の関数を定義（ロゴ画像は小さく表示）
  const renderCard = (
    entry: TimelineEntry,
    color: ColorInfo,
    yearRange: string
  ) => {
    return (
      <Card
        entry={entry}
        color={color}
        yearRange={yearRange}
        imageStyle="small"
      />
    )
  }

  return <Timeline entries={entries} renderCard={renderCard} />
}
