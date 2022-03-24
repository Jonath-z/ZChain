import { NextPage } from 'next';
import React from 'react';
import MyItems from '../components/MyItems';
import MetaData from '../modules/MetaData/Head';

const MyNfts: NextPage = () => {
    return (
        <>
            <MetaData content="ZChain My NFTs" title="My NFTs"/>
            <MyItems />
        </>
    );
}

export default MyNfts;