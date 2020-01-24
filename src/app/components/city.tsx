import PhotoView from "./photo";
import css from './city.module.css'

import { Photo } from '../../@types/Photo'

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function City({ city, photos }: { city: string | string[], photos: Photo[] }) {
  return (
    <div className={css.City}>
      <h2 className={css.name}>{city}</h2>
      {
        shuffle(photos).map((p, i) => {
          const src = p.url;
          return <PhotoView key={i} photo={p} src={src} align={i % 2} />;
        })
      }
    </div>
  );
}

export default City
