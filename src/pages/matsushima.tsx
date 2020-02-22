import { NextPage } from 'next'

import City from '../components/city';
import Nav from '../components/Nav'

const Kyoto: NextPage = () => {
  return (
    <>
      <Nav fixed={true} city='matsushima' />
      <City city='matsushima' />
    </>
  )
};
export default Kyoto;
