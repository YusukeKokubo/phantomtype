import { NextPage } from 'next'

import City from '../components/city';
import Nav from '../components/Nav'

const Kyoto: NextPage = () => {
  return (
    <>
      <Nav fixed={true} city='kyoto' />
      <City city='kyoto' />
    </>
  )
};
export default Kyoto;
