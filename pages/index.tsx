import type { NextPage } from 'next'
import HomePage from '../components/Home';
import MetaData from '../modules/MetaData/Head';

const Home: NextPage = () => {
  return (
    <>
      <MetaData content="ZChain home"/>
      <HomePage />
    </>
  );
}

export default Home;