import format from 'date-fns/format';
import firebase from 'firebase';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Photo } from '../../@types/Photo';
import LikeView from './like';

function datetime(src: firebase.firestore.Timestamp) {
  const wrap = new firebase.firestore.Timestamp(src.seconds, src.nanoseconds)
  const result = format(wrap.toDate(), 'yyyy/MM/dd HH:mm:ss')
  return result
}

function PhotoDetail({ fb, photo }: { fb: firebase.app.App, photo: Photo }) {
  const e = photo

  return (
    <section>
      <picture>
        <source type='image/webp' srcSet={e.urls.webp} />
        <LazyLoadImage className='' src={e.urls.lowQuality} alt={e.city} />
      </picture>
      <div className='grid grid-row-0 gap-2'>
        <div>
          <LikeView fb={fb} photo={photo} />
        </div>
        <table className='text-base '>
          <tbody>
            <tr>
              <th>DateTimeOriginal</th>
              <td>{datetime(e.exif.DateTimeOriginal)}</td>
            </tr>
            <tr>
              <th>Make / Model</th>
              <td>{e.image.Make} {e.image.Model}</td>
            </tr>
            <tr>
              <th>FocalLength(mm) / In35mm</th>
              <td>{e.exif.FocalLength} / {e.exif.FocalLengthIn35mmFormat}</td>
            </tr>
            <tr>
              <th>FNumber</th>
              <td>F{e.exif.FNumber}</td>
            </tr>
            <tr>
              <th>ExposureTime (S)</th>
              <td>{e.exif.ExposureTime}</td>
            </tr>
            <tr>
              <th>ISO</th>
              <td>{e.exif.ISO}</td>
            </tr>
            <tr>
              <th>Lens</th>
              <td>{e.exif.LensMake} {e.exif.LensModel}</td>
            </tr>
            <tr>
              <th>Software</th>
              <td>{e.image.Software}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default PhotoDetail;
