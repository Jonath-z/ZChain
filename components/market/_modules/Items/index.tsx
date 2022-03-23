/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import Loading from '../../../../modules/Loading';
import Header from '../../../Home/_modules/Header';
import Link from 'next/link';
import { FaEthereum } from 'react-icons/fa';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import Zoom from '../../../../modules/Zoom';
import buyNft from '../../../../helpers/buyNft';
import loadAllNFts from '../../../../helpers/loadAllNfts';
import useClickOutside from '../../../../hooks/useClickOutside';

const Items = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [isloading, setIsloading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedNft, setZoomedNft] = useState();
  // const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNfts();
  }, []);

  const loadNfts = async () => {
    const result = await loadAllNFts();
    setNfts(result.items);
    setIsloading(result.isloading);
  }

  const toggleZoom = () => {
    setIsZoomed(false)
  }

  const outsideRef = useClickOutside(toggleZoom)
  

  if (!isloading && !nfts.length) return (
    <div className="bg-black h-screen">
      <Header background='bg-black'/>
      <h1 className="text-3xl text-white flex flex-col justify-center items-center h-full">
        <span className="border-b border-[#ffa503]">No Items for Sale</span>
        <span className="text-[#ffa503] text-sm py-2">
          <Link href={'/mint'}>
            Upload item
          </Link>
        </span>
      </h1>
    </div>
  );
  if (isloading) return (<Loading />);

  return (
    <div className="bg-black h-screen overflow-y-auto">
      <Header background='bg-black'/>
      <div className="mt-32 px-36">
        <h1 className="text-white text-5xl py-10">All NFTs for sale</h1>
        <div className="grid grid-cols-4 justify-center gap-5 py-10">
        {nfts.map((nft, index) => { 
          return (
            <div key={index} className="bg-cyan-900 bg-opacity-50 py-3 px-3 rounded-md border border-[#221a0c] hover:transform hover:scale-105 transition">
              <img src={nft.image} alt="nft-image" className="w-96 rounded-md" />
              <div className="text-white py-3">
                <p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ffa503]">{nft.name}</p>
                <p className="max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">{nft.description}</p>
              </div>
              <p className="text-white flex items-center py-3">
                <span >
                  <FaEthereum className="text-5xl text-black bg-[#ffa503] py-3 px-3 rounded-full shadow-lg" />
                </span>
                <span className="px-3">
                  {nft.price} ETH
                </span>
              </p>
              <div className="flex justify-between items-center">
                <button className="bg-[#ffa503] py-3 px-20 my-3 w-full rounded-lg" onClick={() => buyNft(nft,loadNfts)}>
                  Purchace
                </button>
                <div>
                  <MdOutlineZoomOutMap
                    className="py-3 px-3 text-white text-5xl rounded-full border border-[#ffa503] ml-3 cursor-pointer"
                    onClick={() => {
                      setIsZoomed(!isZoomed);
                      setZoomedNft(nft);
                    }}
                  />
                  </div>
              </div>
            </div>
          );
        })}
          </div>
      </div>
      {
        isZoomed &&
        <div className="absolute bg-black bg-opacity-90 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <Zoom nft={zoomedNft} loadNfts={loadNfts} />
        </div>
      }
    </div>
  );
};

export default Items;
