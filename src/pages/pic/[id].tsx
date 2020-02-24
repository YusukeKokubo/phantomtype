import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { FixedNav } from '../../components/Nav'
import PhotoDetail from '../../components/photoDetail'

import { createStyles, makeStyles } from '@material-ui/core'

import 'firebase/firestore'
import Head from 'next/head'
import { Photo } from '../../../@types/Photo'
import firebase from '../../firebase'

const useStyles = makeStyles(() => createStyles({
  root: {
    padding: '3vh 5vw',
    margin: '3vh 0',
  },
}))

const Picture: NextPage<{ value: Photo }> = ({ value }) => {
  const router = useRouter()
  const { id }: any = router.query
  const classes = useStyles()

  return (
    <>
      <Head>
        <meta property='og:title' content={id} />
        <meta property='og:description' content={`a picutre of ${value.city}`} />
        <meta property='og:image' content={value.urls.resized} />
      </Head>
      <FixedNav city={value.city} />
      <section className={classes.root}>
        {<PhotoDetail fb={firebase.app()} photo={value} />}
      </section>
    </>
  )
};
Picture.getInitialProps = async (context) => {
  const { id } = context.query

  // const [v, loading, error] = useDocumentData<Photo>(
  // );
  const docRef = firebase.firestore().collection('pics').doc(id as string)
  const value = (await docRef.get()).data() as Photo
  return { value }
}
export default Picture;
