/* eslint-disable @next/next/no-img-element */
import React, { Ref } from 'react'
import { FaEthereum } from 'react-icons/fa';
import buyNft from '../../helpers/buyNft';

interface IProps{
    nft: any;
    loadNfts: () => void;
    canBuy: boolean;
}

const Zoom = ({nft, loadNfts, canBuy}: IProps) => {
    return (
        <div>
            <div className="bg-cyan-900 py-3 px-3 rounded-md border border-[#221a0c] flex justify-between xsm:flex-col sm:flex-col">
                <a href={nft.image} target="_blank" rel="noreferrer">
                    <img src={nft.image} alt="nft-image" className="w-96 rounded-md" />
                </a>
                <div className="2xl:px-10 lg:px-10">
                    <div className="text-white py-3">
                        <p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ffa503]">{nft.name}</p>
                        <p>{nft.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-white flex items-center py-3">
                            <span >
                                <FaEthereum className="text-5xl text-black bg-[#ffa503] py-3 px-3 rounded-full shadow-lg" />
                            </span>
                            <span className="px-3">
                                {nft.price} ETH
                            </span>
                        </p>
                    </div>
                    {
                        canBuy && <div className="flex justify-between items-center">
                        <button className="bg-[#ffa503] py-3 px-20 my-3 w-full rounded-lg" onClick={() => buyNft(nft, loadNfts)}>
                            Purchase
                        </button>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Zoom;