import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import css from './photo.module.css'

import { format } from 'date-fns'
import { Photo } from '../../@types/Photo';

function datetime(src: firebase.firestore.Timestamp) {
  const result = format(src.toDate(), 'yyyy/MM/dd HH:mm:ss')
  return result
}

function PhotoView({ photo, src, align }: { photo: Photo, src: string, align: number }) {
  const e = photo
  console.log(e)
  return (
    <section className={`${css.Photo} ${align === 1 ? css.Photo_right : null}`}>
      <LazyLoadImage src={src} className={css.Photo_image} />
      <div className={`${css.exif} ${align === 1 ? css.exif_right : null}`}>
        <span className={css.datetime}>{datetime(e.exif.DateTimeOriginal)}</span>
        <span>{e.image.Make} {e.image.Model}</span>
        <span>{e.exif.FocalLength} ({e.exif.FocalLengthIn35mmFormat})mm
        / F{e.exif.FNumber} / {e.exif.ExposureTime}S</span>
        <span>ISO {e.exif.ISO}</span>
        <span>{e.exif.LensMake} {e.exif.LensModel}</span>
      </div>
    </section>
  )
}

export default PhotoView;