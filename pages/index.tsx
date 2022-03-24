import type { NextPage } from 'next'
import HomePage from '../components/Home';
import MetaData from '../modules/MetaData/Head';

const Home: NextPage = () => {
  return (
    <>
      <MetaData content="ZChain home" title="Home"/>
      <HomePage />
    </>
  );
}

export default Home;