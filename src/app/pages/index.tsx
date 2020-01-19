import firebase from 'firebase/app'
import 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import App from '../components/App'
import City from "../components/City";
import css from './index.module.css'

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

export default () => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('pics'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  console.log(value, loading, error)

  return <p>{value && view(value.docs.map((doc) => doc.data() ))}</p>
}

const view = (pics: {}[]) =>
  <App>
    <section className={css.splash}>
      <img className={css.splash_image}
           src="https://storage.googleapis.com/phantomtype-180814.appspot.com/splash/splash-1.jpg"/>
      <div className={css.title}>
        <img src='/logomark-white.svg' className={css.logo} />
        <h1 className={ css.siteTitle }>PHANTOM TYPE</h1>
        <p className={ css.description }>a Japan photo gallery.</p>
      </div>
    </section>
    <City city='nagoya' description='The Center of Japan' photos={pics} />
  </App>
