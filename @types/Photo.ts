export type Photo = {
  filename: string
  url: string
  exif: Exif
}

export type Exif = {
  Make: string
  Model: string
  DateTimeOriginal: string
  FNumber: string
  FocalLength: string
  FocalLengthIn35mmFormat: string
  ISO: string
  ExposureTime: string
  LensMake: string
  LensModel: string
}

// Just for memo
export type ExifMemo = {
  ApertureValue: string
  BrightnessValue: number
  ColorSpace: number
  CustomRendered: number
  DateTimeDigitized: string
  DateTimeOriginal: string
  ExifVersion: object
  ExposureBiasValue: number
  ExposureMode: number
  ExposureProgram: number
  ExposureTime: string
  FNumber: number
  Flash: number
  FocalLength: number
  FocalLengthIn35mmFormat: number
  FocalPlaneResolutionUnit: number
  FocalPlaneXResolution: number
  FocalPlaneYResolution: number
  ISO: number
  ImageUniqueID: string
  LensMake: string
  LensModel: string
  LensSerialNumber: string
  LnesSpecification: number[]
  LightSource: number
  MaxApertureValue: number
  MeteringMode: number
  PixelXDimension: number
  PixelYDimension: number
  SceneCaptureType: number
  SensingMethod: number
  SensitivityType: number
  Sharpness: number
  ShutterSpeedValue: string
  SubjectDistanceRange: number
  WhiteBalance: number
}
