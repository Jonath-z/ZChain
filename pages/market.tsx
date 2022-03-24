import { NextPage } from 'next';
import React from 'react';
import MarketPage from '../components/market';
import MetaData from '../modules/MetaData/Head'

const Market: NextPage = () => {
    return (
        <>
            <MetaData content="ZChain-Market" />
            <MarketPage />
        </>
    );
}

export default Market;