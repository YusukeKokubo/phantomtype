import { NextPage } from 'next'

import City from '../../components/city';
import { FixedNav } from '../../components/Nav'

const CityPage: NextPage<{ city: string }> = ({ city }) => {
  return (
    <>
      <FixedNav city={city} />
      <City city={city} />
    </>
  )
};
CityPage.getInitialProps = async (context) => {
  const { city }: any = context.query
  console.log(city)
  return { city }
}
export default CityPage;
