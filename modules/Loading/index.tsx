/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/image';
import logo from '../../public/static/logo.png';
import styles from '../../styles/loading.module.css';

const Loading = () => {
    return (
        <div className="bg-black flex items-center align-middle h-screen">
            <div style={{
                margin: "0 auto"
            }}>
                <Image
                    src={logo}
                    alt="loading"
                    className={styles.loading}
                    width="300"
                    height="300"
                />
            </div>
        </div>
    );
}

export default Loading;