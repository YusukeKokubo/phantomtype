export type Photo = {
  filename: string
  city: string
  location: string
  /** Astro glob key: /src/assets/pics/{city}/{location}/{filename} */
  url: string
  lqip?: string
  exif: Exif | null
}

export type City = {
  city: string
  locations: Location[]
}

export type Location = {
  location: string
  pics: Photo[]
}

export type Exif = {
  ImageWidth: number
  ImageLength: number
  Make: string
  Model: string
  DateTimeOriginal: string
  FNumber: string | number
  FocalLength: string
  FocalLengthIn35mmFormat: number
  ISO: number
  ExposureTime: string
  LensMake: string
  LensModel: string
}

