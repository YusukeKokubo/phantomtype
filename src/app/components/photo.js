import React from "react";

import { Photo as P } from '../pages/style'
import { format } from 'date-fns'

function datetime(src) {
  console.log(src)
  const result = format(src.toDate(), 'yyyy/MM/dd')
  console.log(result)
  return result
}

function Photo({photo, src, align}) {
  console.log(photo)
  const e = photo
  return (
    <P className={`Photo ${align == 1 ? "Photo-right": null}`}>
      <img className='Photo-img' src={src} style={{width: '500px'}} />
      <div className={`exif ${align == 1 ? "exif-right": null}`}>
        <span>{e.image.Make} {e.image.Model}</span>
        <span>{datetime(e.exif.DateTimeOriginal)}</span>
        {/* <span>{e.exif.FocalLength.Numerator / e.exif.FocalLength.Denominator}mm ({e.exif.FocalLengthIn35mmFilm}mm) ／ F{e.exif.FNumber.Numerator / e.exif.FNumber.Denominator} ／ {e.exif.ExposureTime.Numerator} / {e.exif.ExposureTime.Denominator}S</span>
        <span>ISO {e.ISOSpeedRatings}</span>
        <span>{e.LensMake} {e.LensModel}</span> */}
      </div>
    </P>
  )
}

export default Photo;
