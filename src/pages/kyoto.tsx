import { NextPage } from 'next'

import { FixedNav } from '../components/Nav'

import 'firebase/firestore'
import firebase from '../firebase'
import { Photo } from '../../@types/Photo';
import PhotoView from '../components/photo';

import { shuffle } from '../lib/shuffle'

const Kyoto: NextPage<{ pics: any }> = (props) => {
  const pics = JSON.parse(props.pics) as Photo[]
  console.log(pics.map(p => p.filename))
  return (
    <>
      <FixedNav city={'kyoto'} />
      <div className='grid gap-16 grid-rows-1'>
        <h2 className='mt-16 text-4xl text-center'>KYOTO</h2>
        {
          shuffle(pics).map((p, i) => {
            return <PhotoView fb={firebase.app()} key={i} photo={p} align={i % 2} />;
          })
        }
      </div>
    </>
  )
};

export async function getStaticProps() {
  const db = await firebase.firestore().collection('pics').where('city', '==', 'kyoto').get()
  const pics = db.docs.map(d => d.data())

  return {
    props: { pics: JSON.stringify(pics) }
  }
}

export default Kyoto;
