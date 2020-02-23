import { NextPage } from 'next'

import City from '../components/city';
import { FixedNav } from '../components/Nav'

const Kyoto: NextPage = () => {
  return (
    <>
      <FixedNav city='nagoya' />
      <City city='nagoya' />
    </>
  )
};
export default Kyoto;
