import type { TimelineEntry } from "../../../../@types/About"
import { formatDateRange } from "./utils"

export function Entry({ entry }: { entry: TimelineEntry }) {
  const content = (
    <div class="flex gap-4">
      {entry.image && (
        <div class="shrink-0 w-32 md:w-40">
          <img
            src={entry.image}
            alt={entry.title}
            class="w-full h-auto object-contain rounded"
            loading="lazy"
          />
        </div>
      )}
      <div class="flex flex-col gap-1 flex-1">
        <div class="flex items-center gap-2">
          <span class="text-sm text-text-secondary">
            {formatDateRange(entry.date, entry.endDate)}
          </span>
        </div>
        <div class="font-medium">{entry.title}</div>
        {entry.description && (
          <div class="text-sm text-text-secondary">{entry.description}</div>
        )}
      </div>
    </div>
  )

  if (entry.url) {
    return (
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        class="block py-2 border-b border-border hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {content}
      </a>
    )
  }

  if (entry.detail) {
    const entryId = `entry-${entry.date}-${entry.title.replace(/\s+/g, "-")}`
    // 改行をエスケープ（Hono JSXが属性値を自動エスケープするため）
    const detailForAttr = entry.detail.replace(/\n/g, "\\n")
    return (
      <button
        type="button"
        data-entry-id={entryId}
        data-entry-title={entry.title}
        data-entry-detail={detailForAttr}
        class="w-full text-left py-2 border-b border-border hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
      >
        {content}
      </button>
    )
  }

  return <div class="py-2 border-b border-border">{content}</div>
}
