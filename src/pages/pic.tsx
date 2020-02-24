import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Nav } from '../components/Nav'
import PhotoDetail from '../components/photoDetail'

import { createStyles, makeStyles } from '@material-ui/core'

import 'firebase/firestore'
import Head from 'next/head'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Photo } from '../../@types/Photo'
import firebase from '../firebase'

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

  // console.log(id)

  // const [value, loading, error] = useDocumentData<Photo>(
  //   firebase.firestore().collection('pics').doc(id || 'dummy'),
  // );
  return (
    <>
      <Head>
        <meta property='og:title' content={id} />
        <meta property='og:site_name' content='PHANTOM TYPE' />
        <meta property='og:type' content='article' />
        <meta property='og:image' content={value.urls.resized} />
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:site' content='@yusuke_kokubo' />
      </Head>
      {/* {error ? <div>{error.message}</div> : null} */}
      <Nav />
      <section className={classes.root}>
        {<PhotoDetail fb={firebase.app()} photo={value!} />}
      </section>
    </>
  )
};
Picture.getInitialProps = async (context) => {
  const { id } = context.query
  console.log('ooh')
  console.log(id as string)
  console.log(context.pathname)

  const [v, loading, error] = useDocumentData<Photo>(
    firebase.firestore().collection('pics').doc(id as string),
  );
  const value = v!
  return { value }
}
export default Picture;
