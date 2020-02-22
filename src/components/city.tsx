import css from './city.module.css'
import PhotoView from './photo';

import { Photo } from '../../@types/Photo'

import 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import firebase from '../firebase'

import './random'

declare global {
  // tslint:disable-next-line: interface-name
  interface Math {
    seed(seed: number): void;
  }
}

const shuffle = ([...array]) => {
  Math.seed(new Date().getHours())
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function City({ city }: { city: string }) {

  const [value, loading, error] = useCollection(
    firebase.firestore().collection('pics').where('city', '==', city),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  console.log(value, loading, error)
  const photos = value ? value.docs.map((doc) => doc.data() as Photo) : []

  return (
    <div className={css.City}>
      <h2 className={css.name}>{city}</h2>
      {
        shuffle(photos).map((p, i) => {
          return <PhotoView fb={firebase.app()} key={i} photo={p} align={i % 2} />;
        })
      }
    </div>
  );
}

export default City
