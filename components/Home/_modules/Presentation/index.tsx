import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../../styles/presentation.module.css';
import { useRouter } from 'next/router';

const services = ['Discover', 'Sell', 'Mint', 'Buy'];
const Presentation = () => {
  const [service, setService] = useState('Sell');
  const index = useRef(0);
  const route = useRouter();

  useEffect(() => {
    const displayService = () => {
      if (index.current === services.length) index.current = 0;
      setService(services[index.current]);
      index.current += 1;
    };

    setTimeout(displayService, 3000);
  }, [service]);

  return (
    <div className="text-white flex flex-col px-10 mt-96 lg:mt-44 sm:mt-32 xsm:mt-32">
      <p className="text-7xl xsm:text-5xl sm:text-5xl">
        <span className={`text-[#ffa503] ${styles.service}`}>
          {service}{' '}
        </span>
        unique NFTs
        <br />
        and Digital arts on our
        <br />
        platform with ease
      </p>
      <button
        className="bg-[#ffa503] w-48 py-3 my-10  text-black rounded-md hover:bg-opacity-80"
        onClick={() => route.push('/mint')}
      >
        Mint Your Nft now
      </button>
    </div>
  );
};

export default Presentation;
