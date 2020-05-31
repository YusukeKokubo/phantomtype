import { NextPage } from 'next'

import 'firebase/firestore'
import firebase from 'firebase'

import { FixedNav } from '../../components/Nav'
import { Photo } from '../../../@types/Photo';
import PhotoView from '../../components/photo';

import { shuffle } from '../../lib/shuffle'

const CityPage: NextPage<{ city: string, picsData: any }> = ({ city, picsData }) => {
  const pics = JSON.parse(picsData) as Photo[]
  console.log(pics.map(p => p.exif.LensModel))
  return (
    <>
      <FixedNav city={city} />
      <div className='grid gap-16 grid-rows-1'>
        <h2 className='mt-16 text-4xl text-center uppercase'>{city}</h2>
        {
          shuffle(pics).map((p, i) => {
            return <PhotoView fb={firebase.app()} key={i} photo={p} align={i % 2} />;
          })
        }
      </div>
    </>
  )
};

export async function getStaticPaths() {
  return {
    paths: ['/kyoto', '/nagoya', '/kanazawa', '/matsushima'],
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const db = await firebase.firestore().collection('pics').where('city', '==', params.city).get()
  const pics = db.docs.map(d => d.data())

  return {
    props: { city: params.city, picsData: JSON.stringify(pics) }
  }
}

export default CityPage;
