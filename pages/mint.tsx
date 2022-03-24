import { NextPage } from 'next';
import React from 'react';
import CreateNft from '../components/CreateNft';
import MetaData from '../modules/MetaData/Head';

const Mint: NextPage = () => {
    return (
        <>
            <MetaData content="ZChain Create NFt" title="Create NFT"/>
            <CreateNft />
        </>
    );
}

export default Mint;