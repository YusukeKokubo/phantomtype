import PhotoView from "./photo";
import css from './city.module.css'

import { Photo } from '../../@types/Photo'

function byDateTime(a, b) {
  if (!a) return 1;
  if (!b) return -1;
  return a.exif.DateTimeOriginal < b.exif.DateTimeOriginal ? 1 : -1;
  return 1
}

function City({ city, photos }: { city: string | string[], photos: Photo[] }) {
  return (
    <div className={css.City}>
      <h2 className={css.name}>{city}</h2>
      {
        photos.sort(byDateTime).map((p, i) => {
          const src = p.url;
          return <PhotoView key={i} photo={p} src={src} align={i % 2} />;
        })
      }
    </div>
  );
}

export default City
