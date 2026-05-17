import type { TimelineEntry } from "../../../../@types/About"
import type { BlogEntry } from "../../../../@types/Blog"
import { useYusukeModal } from "../modal-context"
import type { ColorInfo } from "./Timeline"

type ImageStyle = "large" | "small" | "default"

interface CardProps {
  entry: TimelineEntry | BlogEntry
  color?: ColorInfo
  yearRange?: string
  imageStyle?: ImageStyle // 画像の表示スタイル
  compact?: boolean // コンパクトモード（高さを小さくする）
}

export function Card({
  entry,
  color,
  yearRange,
  imageStyle = "large",
  compact = false,
}: CardProps) {
  const { openEntry } = useYusukeModal()

  // 画像スタイルに応じたクラスを決定
  const getImageClasses = (style: ImageStyle, isCompact: boolean) => {
    // compactモードでは固定の高さで高さを小さくする
    const heightClass = isCompact ? "h-24" : ""
    const aspectRatio = isCompact ? "" : "aspect-video"
    switch (style) {
      case "large":
        // OGP画像など大きな画像用（16:9、カードの端まで広げる）
        return {
          container: `w-full ${aspectRatio} ${heightClass} overflow-hidden bg-gray-100 rounded-md -mx-2 sm:-mx-3 md:-mx-4 mt-[-8px]`,
          image: "w-full h-full object-cover",
        }
      case "small":
        // ロゴなど小さな画像用（固定サイズ、中央揃え）
        return {
          container:
            "w-16 h-16 shrink-0 overflow-hidden bg-gray-100 rounded-md px-2",
          image: "w-full h-full object-contain",
        }
      case "default":
      default:
        // デフォルト（通常のサイズ、カード内に収める）
        return {
          container: `w-full ${aspectRatio} ${heightClass} overflow-hidden bg-gray-100 rounded-md`,
          image: "w-full h-full object-cover",
        }
    }
  }

  const hasImage = "image" in entry && entry.image
  const imageClasses = hasImage ? getImageClasses(imageStyle, compact) : null

  const isSmallStyle = imageStyle === "small"
  const gapClass = compact ? "gap-1" : isSmallStyle ? "gap-3" : "gap-2"
  const textGapClass = compact ? "gap-1" : "gap-2"

  const entryContent = (
    <div
      className={
        isSmallStyle
          ? `flex items-start ${gapClass}`
          : `flex flex-col ${gapClass}`
      }
    >
      {/* 画像 */}
      {hasImage && imageClasses && "image" in entry && (
        <div className={imageClasses.container}>
          <img
            src={entry.image}
            alt={entry.title}
            className={imageClasses.image}
            loading="lazy"
          />
        </div>
      )}
      {/* テキストコンテンツ */}
      <div
        className={
          isSmallStyle ? `flex flex-col ${textGapClass} flex-1 min-w-0` : ""
        }
      >
        {/* 日付範囲 */}
        {yearRange && (
          <div
            className={compact ? "text-xs font-medium" : "text-sm font-medium"}
            style={color ? { color: color.hex } : {}}
          >
            {yearRange}
          </div>
        )}
        {/* タイトル */}
        <div
          className={`font-semibold text-gray-800 ${
            compact ? "text-sm" : "text-md"
          }`}
        >
          {entry.title}
        </div>
        {/* 説明 */}
        {"description" in entry && entry.description && !compact && (
          <div className="text-sm text-gray-600">{entry.description}</div>
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
        className="block h-full hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {entryContent}
      </a>
    )
  }

  if ("detail" in entry && entry.detail) {
    return (
      <button
        type="button"
        onClick={() => openEntry(entry.title, entry.detail!)}
        className="w-full text-left h-full hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
      >
        {entryContent}
      </button>
    )
  }

  return <div className="h-full">{entryContent}</div>
}
