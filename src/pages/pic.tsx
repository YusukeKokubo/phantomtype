import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Nav } from '../components/Nav'
import PhotoDetail from '../components/photoDetail'

import { createStyles, makeStyles } from '@material-ui/core'

import 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import firebase from '../firebase'

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
      <Nav />
      <section className={classes.root}>
        {loading ? null : <PhotoDetail fb={firebase.app()} photo={value} />}
      </section>
    </>
  )
};
export default Picture;
