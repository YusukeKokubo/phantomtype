import { NextPage } from 'next'
import { useRouter } from 'next/router'

import Nav from '../components/Nav'
import PhotoDetail from '../components/photoDetail'

import { createStyles, makeStyles } from '@material-ui/core'
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

const useStyles = makeStyles(() => createStyles({
  root: {
    padding: '3vh 5vw',
    margin: '3vh 0',
  },
}))

const Picture: NextPage = () => {
  const router = useRouter()
  const { id }: any = router.query
  const classes = useStyles()

  console.log(id)

  const [value, loading, error] = useDocumentData(
    firebase.firestore().collection('pics').doc(id || 'dummy'),
  );
  return (
    <>
      {error ? <div>{error.message}</div> : null}
      <Nav fixed={true} />
      <section className={classes.root}>
        {loading ? null : <PhotoDetail fb={firebase.app()} photo={value} />}
      </section>
    </>
  )
};
export default Picture;
