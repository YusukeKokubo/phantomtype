import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import css from './photo.module.css'

import { Button, Paper } from '@material-ui/core';
import { format } from 'date-fns'
import Router from 'next/router'
import { Photo } from '../../@types/Photo';
import LikeView from './like';
import PhotoDetail from './photoDetail';

function datetime(src: firebase.firestore.Timestamp) {
  const result = format(src.toDate(), 'yyyy/MM/dd HH:mm:ss')
  return result
}

const useStyles = makeStyles(({ palette }: Theme) => createStyles({
  Photo: {
    display: 'flex',
    margin: '0 5vw',
    flexDirection: 'row',
  },
  PhotoRight: {
    flexDirection: 'row-reverse',
  },
  Img: {
    width: '55vw',
    height: 'auto',
    minHeight: '300px',
    objectFit: 'fill',
  },
  Information: {
    margin: '0 15px',
    color: '#ccc',
    fontSize: '1.60vw',
    fontWeight: 200,
    display: 'flex',
    flexDirection: 'column',
  },
  Modal: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    backgroundColor: palette.background.default,
    padding: '3vh 5vw',
    overflow: 'scroll',
  },
}))

function PhotoView({ fb, photo, align }: { fb: firebase.app.App, photo: Photo, align: number }) {
  const e = photo
  console.log(e)
  const id = `${photo.city}-${photo.filename}`
  const [detail, setDetail] = useState(false)
  const cs = useStyles()

  return (
    <section className={`${css.Photo} ${align === 1 ? css.Photo_right : null}`}>
      {detail ? <div className={cs.Modal}>
        <Button onClick={() => {
          setDetail(false)
          Router.back()
        }}>Back</Button>
        <PhotoDetail fb={fb} photo={photo} />
      </div> : null}
      <picture>
        <source type='image/webp' srcSet={e.urls.webp} />
        <LazyLoadImage src={e.urls.lowQuality} onClick={() => {
          setDetail(true)
          Router.push(`/${e.city}`, `/pic?id=${encodeURIComponent(id)}`)
        }} className={css.Photo_image} />
      </picture>
      <div className={`${css.information} ${align === 1 ? css.exif_right : null}`}>
        <div className={`${css.exif} ${align === 1 ? css.exif_right : null}`}>
          <span className={css.datetime}>{datetime(e.exif.DateTimeOriginal)}</span>
          <span>{e.image.Make} {e.image.Model}</span>
          <span>{e.exif.FocalLength} ({e.exif.FocalLengthIn35mmFormat})mm
          / F{e.exif.FNumber} / {e.exif.ExposureTime}S</span>
          <span>ISO {e.exif.ISO}</span>
          <span>{e.exif.LensMake} {e.exif.LensModel}</span>
        </div>
        <div className={css.social}>
          <LikeView fb={fb} photo={photo} />
        </div>
      </div>
    </section>
  )
}

export default PhotoView;
