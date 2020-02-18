import { red } from '@material-ui/core/colors';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Cookies from 'js-cookie';

import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import css from './photo.module.css'

import { format } from 'date-fns'
import Router from 'next/router'
import { Photo } from '../../@types/Photo';
import PhotoDetail from './photoDetail';
import { Button } from '@material-ui/core';

function datetime(src: firebase.firestore.Timestamp) {
  const result = format(src.toDate(), 'yyyy/MM/dd HH:mm:ss')
  return result
}

function onLike(fb: firebase.app.App, photo: Photo) {
  const id = `${photo.city}-${photo.filename}`
  fb.firestore().collection('pics').doc(id).set({
    ...photo,
    like: (photo.like || 0) + 1,
  }).then(() => {
    Cookies.set(id, '1')
    console.log('Liked: ', id)
  })
  return null
}

function onUnLike(fb: firebase.app.App, photo: Photo) {
  const id = `${photo.city}-${photo.filename}`
  fb.firestore().collection('pics').doc(id).set({
    ...photo,
    like: (photo.like || 0) - 1,
  }).then(() => {
    Cookies.set(id, '0')
    console.log('UnLiked: ', id)
  })
  return null
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
  YetLiked: {
    margin: '-3px 2px',
    fontSize: '2.0vw',
    color: palette.text.primary,
    '&:hover': {
      cursor: 'pointer',
      color: red[600],
    },
    '@media (max-width: 600px)': {
      'font-size': '1.0rem',
    },
  },
  Liked: {
    margin: '-3px 2px',
    fontSize: '2.0vw',
    color: red[600],
    '&:hover': {
      cursor: 'pointer',
      color: '#fff',
    },
    '@media (max-width: 600px)': {
      'font-size': '1.0rem',
    },
  },
  Modal: {
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    position: 'fixed',
    backgroundColor: palette.background.default,
    padding: '3vh 5vw',
  },
}))

function PhotoView({ fb, photo, align }: { fb: firebase.app.App, photo: Photo, align: number }) {
  const e = photo
  console.log(e)
  const id = `${photo.city}-${photo.filename}`
  const liked = Cookies.get(id) === '1'
  const [detail, setDetail] = useState(false)
  const cs = useStyles()

  return (
    <section className={`${css.Photo} ${align === 1 ? css.Photo_right : null}`}>
      {detail ? <div className={cs.Modal}>
        <Button onClick={() => {
          setDetail(false)
          Router.back()
        }}>Back</Button>
        <PhotoDetail photo={photo} />
      </div> : null}
      <picture>
        <source type='image/webp' srcSet={e.urls.webp} />
        <LazyLoadImage src={e.urls.lowQuality} onClick={() => {
          setDetail(true)
          Router.push(`/${e.city}`, `/pic/${encodeURIComponent(id)}`)
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
          <span>
            {liked ?
              <Favorite
                onClick={() => onUnLike(fb, photo)}
                className={cs.Liked}
              />
              :
              <FavoriteBorder
                onClick={() => onLike(fb, photo)}
                className={cs.YetLiked}
              />
            }
          </span>
          <span className={css.like}>{photo.like || 0} like(s)</span>
        </div>
      </div>
    </section>
  )
}

export default PhotoView;
