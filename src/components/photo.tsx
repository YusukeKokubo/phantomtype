import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import firebase from '../firebase'

import { Button } from '@material-ui/core';
import { format } from 'date-fns'
import { Photo } from '../../@types/Photo';
import LikeView from './like';
import PhotoDetail from './photoDetail';

function datetime(src: firebase.firestore.Timestamp) {
  const result = format(new firebase.firestore.Timestamp(src.seconds, src.nanoseconds).toDate(), 'yyyy/MM/dd HH:mm:ss')
  return result
}

function PhotoView({ fb, photo, align }: { fb: firebase.app.App, photo: Photo, align: number }) {
  const e = photo
  const id = `${photo.city}-${photo.filename}`
  const [detail, setDetail] = useState(false)

  return (
    <section className={`flex flex-col ${align === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {detail ? <div className='w-full h-full fixed top-0 left-0 bg-black p-3 overflow-scroll'>
        <Button onClick={() => {
          setDetail(false)
          history.back()
        }}>Back</Button>
        <PhotoDetail fb={fb} photo={photo} />
      </div> : null}
      <picture>
        <source type='image/webp' srcSet={e.urls.webp} />
        <LazyLoadImage src={e.urls.lowQuality} alt={e.city} onClick={() => {
          setDetail(true)
          history.pushState(`/${e.city}`, '', `/pic/${encodeURIComponent(id)}`)
        }} className='w-full md:w-70v h-auto' />
      </picture>
      <div className={`mx-3 text-base font-light flex flex-col ${align === 1 ? 'text-right' : null}`}>
        <div className='flex flex-col justify-start'>
          <span className='text-xl mb-2'>{datetime(e.exif.DateTimeOriginal)}</span>
          <span>{e.image.Make} {e.image.Model}</span>
          <span>{e.exif.LensModel}</span>
          <span style={{ marginTop: 5 }}>{e.exif.FocalLength} ({e.exif.FocalLengthIn35mmFormat})mm
          | F{e.exif.FNumber} | {e.exif.ExposureTime}S</span>
          <span>ISO {e.exif.ISO}</span>
        </div>
        <div className='mt-2'>
          <LikeView fb={fb} photo={photo} />
        </div>
      </div>
    </section>
  )
}

export default PhotoView;
