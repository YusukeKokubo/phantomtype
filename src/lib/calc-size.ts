import type { Exif } from "../../@types/Photo"

/**
 * Fit image dimensions within a bounding box while preserving aspect ratio.
 */
export function calcSize(
  exif: Exif | null | undefined,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (!exif) {
    return { width: maxWidth, height: maxHeight }
  }

  const width = exif.ImageWidth
  const height = exif.ImageLength
  const aspectRatio = width / height

  let newWidth = maxWidth
  let newHeight = maxWidth / aspectRatio

  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = maxHeight * aspectRatio
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) }
}
