/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Loading from '../../../../modules/Loading';
import Header from '../../../Home/_modules/Header';
import Link from 'next/link';
import { FaEthereum } from 'react-icons/fa';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import Zoom from '../../../../modules/Zoom';
import buyNft from '../../../../helpers/buyNft';
import loadAllNFts from '../../../../helpers/loadAllNfts';
import { HiOutlinePlus } from 'react-icons/hi';

const Items = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [isloading, setIsloading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedNft, setZoomedNft] = useState();

  useEffect(() => {
    loadNfts();
  }, []);

  const loadNfts = async () => {
    const result = await loadAllNFts();
    setNfts(result.items);
    setIsloading(result.isloading);
  };

  const toggleZoom = () => {
    setIsZoomed(false);
  };

  const onChange = (e: any) => {
    const inputValue = e.target.value;
    const nftsList = document.getElementsByClassName(
      'nft-card'
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < nftsList.length; i++) {
      const nftName = nftsList[i].querySelectorAll('.nft-name')[0];
      if (nftName !== undefined) {
        const nftNameText = nftName.innerHTML;
        if (
          nftNameText
            .toUpperCase()
            .indexOf(inputValue.toUpperCase()) > -1
        ) {
          nftsList[i].style.display = 'flex';
        } else {
          nftsList[i].style.display = 'none';
        }
      }
    }
  };

  if (!isloading && !nfts.length)
    return (
      <div className="bg-black h-screen">
        <Header
          background="bg-black"
          activeMenu="explore"
          onChange={onChange}
          isSearchAvailabe={true}
        />
        <h1 className="text-3xl text-white flex flex-col justify-center items-center h-full">
          <span className="border-b border-[#ffa503]">
            No Items for Sale
          </span>
          <span className="text-[#ffa503] text-sm py-2">
            <Link href={'/mint'}>Upload item</Link>
          </span>
        </h1>
      </div>
    );
  if (isloading) return <Loading />;

  return (
    <div className="bg-black">
      <Header
        background="bg-black"
        activeMenu="explore"
        onChange={onChange}
        isSearchAvailabe={true}
      />
      <div className="bg-black h-screen overflow-y-auto">
        <div className="mt-32 px-36 xsm:mt-5 sm:mt-5 xsm:px-5 sm:px-5 lg:px-10 lg:mt-2">
          <h1 className="text-white text-5xl py-10 xsm:py-0 sm:py-0 xsm:text-3xl sm:text-3xl">
            All NFTs for sale
          </h1>
          <div className="2xl:grid 2xl:grid-cols-4 lg:grid lg:grid-cols-3 lg:gap-5 justify-center 2xl:gap-5 py-10 sm:flex sm:flex-col xsm:flex xsm:flex-col">
            {nfts.map((nft, index) => {
              return (
                <div
                  key={index}
                  className="bg-cyan-900 bg-opacity-50 py-3 px-3  flex flex-col rounded-md border border-[#221a0c] xsm:my-4 sm:my-4 hover:transform 2xl:hover:scale-105 transition nft-card"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-fill rounded-md h-60 object-cover"
                  />
                  <div className="text-white py-3">
                    <p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ffa503] nft-name">
                      {nft.name}
                    </p>
                    <p className="max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
                      {nft.description}
                    </p>
                  </div>
                  <p className="text-white flex items-center py-3">
                    <span>
                      <FaEthereum className="text-5xl text-black bg-[#ffa503] py-3 px-3 rounded-full shadow-lg" />
                    </span>
                    <span className="px-3">{nft.price} ETH</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      className="bg-[#ffa503] py-3 px-20 my-3 w-full rounded-lg"
                      onClick={() => {
                        buyNft(nft, loadNfts);
                        setIsZoomed(false);
                      }}
                    >
                      Purchase
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
        {isZoomed && (
          <div className="absolute bg-black bg-opacity-90 top-0 left-0 right-0 bottom-0 flex justify-center items-center overflow-scroll">
            <HiOutlinePlus
              className="text-white absolute right-10 top-10 text-xl rotate-45 cursor-pointer"
              onClick={toggleZoom}
            />
            <Zoom nft={zoomedNft} loadNfts={loadNfts} canBuy={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
