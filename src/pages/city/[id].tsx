import { NextPage } from 'next'

import City from '../../components/city';
import { FixedNav } from '../../components/Nav'

const CityPage: NextPage<{ id: string }> = ({ id }) => {
  return (
    <>
      <FixedNav city={id} />
      <City city={id} />
    </>
  )
};
CityPage.getInitialProps = async (context) => {
  const { id }: any = context.query
  console.log(id)
  return { id }
}
export default CityPage;
