import type { GalleryEntry } from "../../../../../@types/About"

export function PersonalContent({ entries }: { entries: GalleryEntry[] }) {
  if (entries.length === 0) {
    return <p class="text-text-secondary">コンテンツを追加してください</p>
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry, i) => {
        const cardContent = (
          <div class="flex flex-col h-full bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {entry.image ? (
              <div class="w-full aspect-video overflow-hidden bg-surface-secondary">
                <img
                  src={entry.image}
                  alt={entry.title}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div class="p-4 flex flex-col gap-2 flex-1">
              <div class="font-medium text-lg">{entry.title}</div>
              {entry.description && (
                <div class="text-sm text-text-secondary line-clamp-2">
                  {entry.description}
                </div>
              )}
            </div>
          </div>
        )

        if (entry.url) {
          return (
            <a
              key={i}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              class="block focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {cardContent}
            </a>
          )
        }

        if (entry.detail) {
          const entryId = `entry-${i}-${entry.title.replace(/\s+/g, "-")}`
          const detailForAttr = entry.detail.replace(/\n/g, "\\n")
          return (
            <button
              key={i}
              type="button"
              data-entry-id={entryId}
              data-entry-title={entry.title}
              data-entry-detail={detailForAttr}
              class="text-left focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
            >
              {cardContent}
            </button>
          )
        }

        return <div key={i}>{cardContent}</div>
      })}
    </div>
  )
}
