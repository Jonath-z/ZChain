import React from 'react';
import Header from './_modules/Header';
import Presentation from './_modules/Presentation';
import styles from '../../styles/Home.module.css';
import { useMediaQuery } from 'react-responsive'

const HomePage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  const onChange = (e: any) => {
    return;
  }

  return (
    <>
    <div className={`${!isMobile ? 'grid grid-cols-2 bg-black h-screen' : `${styles.homeBg} h-screen `}`}>
      <div className="h-full">
        <Header isSearchAvailabe={false} activeMenu=" " background={'bg-transparent'} onChange={onChange}/>
        <Presentation />
      </div>
      {!isMobile && <div className={styles.homeBg} />}
      </div>
      </>
  );
};

export default HomePage;
