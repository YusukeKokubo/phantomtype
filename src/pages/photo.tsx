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
      <div class="md:h-[calc(100vh-4rem)] overflow-y-scroll">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="mb-4">
            <a
              href={`/${city}`}
              class="text-gray-400 hover:text-white text-lg uppercase"
            >
              ← {city}
            </a>
          </div>

          <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1">
              <img
                src={photo.url}
                width={width}
                height={height}
                alt={`${city} ${name}`}
                class="w-full h-auto"
              />
            </div>

            {exif && (
              <div class="md:w-80 shrink-0">
                <div class="bg-gray-900/50 p-6 rounded-lg">
                  <h2 class="text-2xl font-light mb-4 uppercase">{name}</h2>
                  <div class="space-y-4 text-sm">
                    <div>
                      <div class="text-gray-400 mb-1">撮影日時</div>
                      <div class="text-white">{exif.DateTimeOriginal}</div>
                    </div>
                    <div>
                      <div class="text-gray-400 mb-1">カメラ</div>
                      <div class="text-white">
                        {exif.Make} {exif.Model}
                      </div>
                    </div>
                    <div>
                      <div class="text-gray-400 mb-1">レンズ</div>
                      <div class="text-white">
                        {exif.LensModel.replace(/\0/g, "")}
                      </div>
                    </div>
                    <div>
                      <div class="text-gray-400 mb-1">撮影設定</div>
                      <div class="text-white space-y-1">
                        <div>
                          焦点距離: {exif.FocalLength} (
                          {exif.FocalLengthIn35mmFormat}mm)
                        </div>
                        <div>絞り: {exif.FNumber}</div>
                        <div>シャッター速度: {exif.ExposureTime}S</div>
                        <div>ISO: {exif.ISO}</div>
                      </div>
                    </div>
                    <div>
                      <div class="text-gray-400 mb-1">解像度</div>
                      <div class="text-white">
                        {exif.ImageWidth} × {exif.ImageLength}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div class="mt-8">
            <Nav city={city} cities={cities} />
          </div>
        </div>
      </div>
    </>
  )
}
