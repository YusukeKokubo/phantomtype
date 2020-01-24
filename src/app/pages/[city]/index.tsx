import firebase from 'firebase/app'
import 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import City from "../../components/city";
import App from '../../components/App'
import { FixedNav } from '../../components/Nav'

import { Photo } from '../../../@types/Photo'

const config = {
  apiKey: "AIzaSyA8wsdQlLLAjZepeaQfeM_l0pfBEaCOyEk",
  authDomain: "phantomtype.firebaseapp.com",
  databaseURL: "https://phantomtype.firebaseio.com",
  projectId: "phantomtype",
  storageBucket: "phantomtype.appspot.com",
  messagingSenderId: "787190095643",
  appId: "1:787190095643:web:2ea9b8a2fb64946b27bdbe",
  measurementId: "G-TGRBP7DHKD"
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const CityPage: NextPage = () => {
  const router = useRouter();
  const { city } = router.query;
  console.log(city)

  const [value, loading, error] = useCollection(
    firebase.firestore().collection('pics').where('city', '==', city || ''),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  console.log(value, loading, error)
  const photos = value ? value.docs.map((doc) => doc.data() as Photo) : []

  return (
    <App>
      <FixedNav />
      <City city={city} photos={photos} />
    </App>
  )
};
export default CityPage;

