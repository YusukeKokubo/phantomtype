import type { GalleryEntry } from "../../../../../@types/About"
import { useYusukeModal } from "../../modal-context"

export function PersonalContent({ entries }: { entries: GalleryEntry[] }) {
  const { openEntry } = useYusukeModal()
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

        if (entry.detail) {
          return (
            <div key={i} class="flex flex-col">
              <button
                type="button"
                onClick={() => openEntry(entry.title, entry.detail)}
                class="text-left focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
              >
                {cardContent}
              </button>
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mx-4 mb-4 text-sm text-text-secondary hover:text-foreground underline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  サイトを開く
                </a>
              ) : null}
            </div>
          )
        }

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

        return <div key={i}>{cardContent}</div>
      })}
    </div>
  )
}
