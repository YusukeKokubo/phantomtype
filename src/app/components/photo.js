import React from "react";
import css from './photo.module.css'

import { format } from 'date-fns'

function datetime(src) {
  const result = format(src.toDate(), 'yyyy/MM/dd')
  return result
}

function Photo({photo, src, align}) {
  console.log(photo)
  const e = photo
  return (
    <section className={`${css.Photo} ${align == 1 ? css.Photo_right: null}`}>
      <img className={css.Photo_image} src={src} />
      <div className={`${css.exif} ${align == 1 ? css.exif_right: null}`}>
        <span>{e.image.Make} {e.image.Model}</span>
        <span>{datetime(e.exif.DateTimeOriginal)}</span>
        {/* <span>{e.exif.FocalLength.Numerator / e.exif.FocalLength.Denominator}mm ({e.exif.FocalLengthIn35mmFilm}mm) ／ F{e.exif.FNumber.Numerator / e.exif.FNumber.Denominator} ／ {e.exif.ExposureTime.Numerator} / {e.exif.ExposureTime.Denominator}S</span> */}
        <span>{e.exif.FocalLength} ({e.exif.FocalLengthIn35mmFormat})mm 
        / F{e.exif.FNumber} / {e.exif.ExposureTime}S</span>
        <span>ISO {e.exif.ISO}</span>
        <span>{e.exif.LensMake} {e.exif.LensModel}</span>
      </div>
    </section>
  )
}

export default Photo;
