import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../../styles/presentation.module.css';

const services = ['Discover', 'Sell', 'Mint', 'Buy'];
const Presentation = () => {
  const [service, setService] = useState('Sell');
  const index = useRef(0);

  useEffect(() => {
    const displayService = () => {
      if (index.current === services.length) index.current = 0;
      setService(services[index.current]);
      index.current += 1;
    };

    setTimeout(displayService, 3000);
  }, [service]);

  return (
    <div className="text-white flex flex-col px-10 mt-96">
      <p className="text-7xl">
        <span className={`text-[#ffa503] ${styles.service}`}>
          {service}{' '}
        </span>
        unique NFTs
        <br />
        and Digital arts on our
        <br />
        platform with ease
      </p>
      <button className="bg-[#ffa503] w-40 py-3 my-10 text-black rounded-md hover:bg-opacity-80">
        Get Stared
      </button>
    </div>
  );
};

export default Presentation;
