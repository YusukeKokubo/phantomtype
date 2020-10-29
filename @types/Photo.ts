export type Photo = {
  city: string
  filePath: string
  filename: string
  url: string
  urls: {
    webp: string
    lowQuality: string
    resized: string
  }
  exif: Exif
  image: Image
  thumbnail: {}
  like: number
}

export type Exif = {
  ApertureValue: string
  BrightnessValue: number
  ColorSpace: number
  CustomRendered: number
  DateTimeDigitized: firebase.default.firestore.Timestamp
  DateTimeOriginal: firebase.default.firestore.Timestamp
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

export type Image = {
  ExifOffset: number
  ImageHeight: number
  ImageWidth: number
  Make: string
  Model: string
  ModifyDate: firebase.default.firestore.Timestamp
  Orientation: number
  PhotometricInterpretation: number
  PrimaryChromaticities: number[]
  PrintIM: object
  ResolutionUnit: number
  SamplesPerPixel: number
  Software: string
  WhitePoint: number[]
  XResolution: number
  YCbCrCoefficients: number[]
  YCbCrPositioning: number
  YResolution: number
}
