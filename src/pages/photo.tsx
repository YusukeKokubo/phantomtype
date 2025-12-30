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
      <a href="#main-content" class="skip-link">
        メインコンテンツへスキップ
      </a>
      <Header city={city} cities={cities} />
      <main id="main-content" class="px-4 py-8 flex flex-col gap-4">
        <nav aria-label="パンくずリスト">
          <a
            href={`/${city}`}
            class="text-text-secondary hover:text-foreground text-lg uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ← {city}
          </a>
        </nav>

        <article>
          <img
            src={photo.url}
            width={width}
            height={height}
            alt={`${city} ${name}の写真`}
            class="w-full h-auto"
          />

          {exif && (
            <section aria-labelledby="exif-heading" class="pt-4">
              <h2 id="exif-heading" class="sr-only">
                撮影情報
              </h2>
              <table class="w-full">
                <caption class="sr-only">EXIF メタデータ</caption>
                <tbody>
                  <tr class="border-b border-border">
                    <th scope="row" class="text-text-secondary text-right pr-4">
                      撮影日時
                    </th>
                    <td>{exif.DateTimeOriginal}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <th scope="row" class="text-text-secondary text-right pr-4">
                      カメラ
                    </th>
                    <td>
                      {exif.Make} {exif.Model}
                    </td>
                  </tr>
                  <tr class="border-b border-border">
                    <th scope="row" class="text-text-secondary text-right pr-4">
                      レンズ
                    </th>
                    <td>{exif.LensModel.replace(/\0/g, "")}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <th scope="row" class="text-text-secondary text-right pr-4">
                      絞り
                    </th>
                    <td>{exif.FNumber}</td>
                  </tr>
                  <tr class="border-b border-border">
                    <th scope="row" class="text-text-secondary text-right pr-4">
                      焦点距離
                    </th>
                    <td>
                      {exif.FocalLength} ({exif.FocalLengthIn35mmFormat} mm)
                    </td>
                  </tr>
                  <tr class="border-b border-border">
                    <th scope="row" class="text-text-secondary text-right pr-4">
                      シャッター速度
                    </th>
                    <td>{exif.ExposureTime}S</td>
                  </tr>
                  <tr class="border-b border-border">
                    <th scope="row" class="text-text-secondary text-right pr-4">
                      ISO
                    </th>
                    <td>ISO {exif.ISO}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </article>
      </main>
    </>
  )
}
