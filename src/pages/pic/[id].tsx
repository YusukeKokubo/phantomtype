import { NextPage } from 'next'
import { useRouter } from 'next/router'

import Nav from '../../components/Nav'
import PhotoDetail from '../../components/photoDetail'

import firebase from 'firebase/app'
import 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'

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

const Picture: NextPage = () => {
  const router = useRouter()
  const { id }: any = router.query

  console.log(id)

  const [value, loading, error] = useDocumentData(
    firebase.firestore().collection('pics').doc(id || 'dummy'),
  );
  return (
    <>
      <Nav fixed={true} />
      {loading ? null : <PhotoDetail photo={value} />}
    </>
  )
};
export default Picture;
