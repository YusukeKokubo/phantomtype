import { City, Photo } from "../../@types/Photo"
import { Header, Nav } from "../components/Nav"

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
      <div class="max-w-screen px-4 py-8 flex flex-col gap-8">
        <a
          href={`/${city}`}
          class="text-gray-400 hover:text-white text-lg uppercase"
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
          <div class="flex flex-wrap gap-4">
            <div>
              <div>撮影日時</div>
              <div>{exif.DateTimeOriginal}</div>
            </div>
            <div>
              <div>カメラ</div>
              <div>
                {exif.Make} {exif.Model}
              </div>
              <div>レンズ</div>
              <div>{exif.LensModel.replace(/\0/g, "")}</div>
            </div>
            <div>
              <div>撮影設定</div>
              <div>
                <div>
                  焦点距離: {exif.FocalLength} ({exif.FocalLengthIn35mmFormat}{" "}
                  mm)
                </div>
                <div>絞り: {exif.FNumber}</div>
                <div>シャッター速度: {exif.ExposureTime}S</div>
                <div>ISO: {exif.ISO}</div>
              </div>
            </div>
            <div>
              <div>解像度</div>
              <div>
                {exif.ImageWidth} × {exif.ImageLength}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
