import css from './city.module.css'
import PhotoView from './photo';

import { Photo } from '../../@types/Photo'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

const config = {
  apiKey: 'AIzaSyA8wsdQlLLAjZepeaQfeM_l0pfBEaCOyEk',
  authDomain: 'phantomtype.firebaseapp.com',
  databaseURL: 'https://phantomtype.firebaseio.com',
  projectId: 'phantomtype',
  storageBucket: 'phantomtype.appspot.com',
  messagingSenderId: '787190095643',
  appId: '1:787190095643:web:2ea9b8a2fb64946b27bdbe',
  measurementId: 'G-TGRBP7DHKD',
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const shuffle = ([...array]) => {
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
          return <PhotoView key={i} photo={p} align={i % 2} />;
        })
      }
    </div>
  );
}

export default City
