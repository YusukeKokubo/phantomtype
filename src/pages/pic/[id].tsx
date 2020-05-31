import { NextPage } from 'next'

import { FixedNav } from '../../components/Nav'
import PhotoDetail from '../../components/photoDetail'

import 'firebase/firestore'
import Head from 'next/head'
import { Photo } from '../../../@types/Photo'
import firebase from '../../firebase'

const Picture: NextPage<{ picData: any }> = ({ picData }) => {
  const pic = JSON.parse(picData) as Photo
  const id = `${pic.city}-${pic.filename}`

  return (
    <>
      <Head>
        <meta property='og:title' content={id} />
        <meta property='og:description' content={`a picutre of ${pic.city}`} />
        <meta property='og:image' content={pic.urls.resized} />
        <meta name='twitter:title' content={id} />
        <meta name='twitter:description' content={`a picutre of ${pic.city}`} />
        <meta name='twitter:image' content={pic.urls.resized} />
      </Head>
      <FixedNav city={pic.city} />
      <section className='px-1 md:px-4 mt-12'>
        {<PhotoDetail fb={firebase.app()} photo={pic} />}
      </section>
    </>
  )
};
export async function getStaticPaths() {
  const docRef = await firebase.firestore().collection('pics').get()
  const value = await docRef.docs.map(d => d.data()) as Photo[]
  const paths = value.map(v => (`/pic/${v.city}-${v.filename}`))
  return {
    paths,
    fallback: false
  }
}
export async function getStaticProps({ params }) {
  const doc = await firebase.firestore().collection('pics').doc(params.id).get()
  const pic = doc.data()
  return { props: { picData: JSON.stringify(pic) } }
}
export default Picture;
