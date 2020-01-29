import { NextPage } from 'next'

import App from '../components/App'
import City from '../components/city';
import { FixedNav } from '../components/Nav'

const Kyoto: NextPage = () => {
  return (
    <App>
      <FixedNav />
      <City city='kanazawa' />
    </App>
  )
};
export default Kyoto;
