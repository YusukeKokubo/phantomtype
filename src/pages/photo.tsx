import type { City, Photo } from "../../@types/Photo"
import { Header } from "../components/Nav"

function calcSize(
  exif: Photo["exif"],
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

export default function PhotoPage({
  city,
  photo,
  cities,
}: {
  city: string
  photo: Photo
  cities: City[]
}) {
  const name = photo.filename.substring(0, photo.filename.indexOf("."))
  const exif = photo.exif
  const { width, height } = calcSize(exif, 1920, 1080)

  return (
    <>
      <Header city={city} cities={cities} />
      <div class="px-4 py-8 flex flex-col gap-4">
        <a
          href={`/${city}`}
          class="text-text-secondary hover:text-foreground text-lg uppercase"
        >
          ← {city}
        </a>

        <img
          src={photo.url}
          width={width}
          height={height}
          alt={`${city} ${name}`}
          class="w-full h-auto"
        />

        {exif && (
          <table>
            <tbody>
              <tr class="border-b border-border">
                <td class="text-text-secondary text-right pr-4">撮影日時</td>
                <td>{exif.DateTimeOriginal}</td>
              </tr>
              <tr class="border-b border-border">
                <td class="text-text-secondary text-right pr-4">カメラ</td>
                <td>
                  {exif.Make} {exif.Model}
                </td>
              </tr>
              <tr class="border-b border-border">
                <td class="text-text-secondary text-right pr-4">レンズ</td>
                <td>{exif.LensModel.replace(/\0/g, "")}</td>
              </tr>
              <tr class="border-b border-border">
                <td class="text-text-secondary text-right pr-4">絞り</td>
                <td>{exif.FNumber}</td>
              </tr>
              <tr class="border-b border-border">
                <td class="text-text-secondary text-right pr-4">焦点距離</td>
                <td>
                  {exif.FocalLength} ({exif.FocalLengthIn35mmFormat} mm)
                </td>
              </tr>
              <tr class="border-b border-border">
                <td class="text-text-secondary text-right pr-4">
                  シャッター速度
                </td>
                <td>{exif.ExposureTime}S</td>
              </tr>
              <tr class="border-b border-border">
                <td class="text-text-secondary text-right pr-4">ISO</td>
                <td>ISO {exif.ISO}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
