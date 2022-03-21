import React from 'react';
import Header from './_modules/Header';
import Presentation from './_modules/Presentation';
import styles from '../../styles/Home.module.css';

const HomePage = () => {
  return (
    <div className="grid grid-cols-2 bg-black h-screen">
      <div className="h-full">
        <Header />
        <Presentation />
      </div>
      <div className={styles.homeBg} />
    </div>
  );
};

export default HomePage;
