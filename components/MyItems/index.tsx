/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from 'axios';
import {
  nftAddress,
  nftMarketplaceAddress,
} from '../../config';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import MARKET from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import Loading from '../../modules/Loading';
import Header from '../../components/Home/_modules/Header';
import Link from 'next/link';
import { FaEthereum } from 'react-icons/fa';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import Zoom from '../../modules/Zoom';
import { HiOutlinePlus } from 'react-icons/hi';



const MyItems = () => {
    const [nfts, setNfts] = useState<any[]>([]);
    const [isloading, setIsloading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomedNft, setZoomedNft] = useState();
  
    useEffect(() => {
        loadMyNfts();
    }, []);

    const loadMyNfts = async () => {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(
            nftMarketplaceAddress,
            MARKET.abi,
            signer
        );
        const tokenContract = new ethers.Contract(
            nftAddress,
            NFT.abi,
            provider
        );
    
        const data = await marketContract.fetchMyNFTs();
    
        const items = await Promise.all(
            data.map(async (item: any) => {
                const tokenUri = await tokenContract.tokenURI(item.tokenId);
                const meta = await axios.get(tokenUri);
    
                const price = ethers.utils.formatUnits(
                    item.price.toString(),
                    'ether'
                );
    
                const dataItem = {
                    price,
                    tokenId: item.tokenId,
                    seller: item.seller,
                    owner: item.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                };
    
                return dataItem;
            })
        );
        setNfts(items);
        setIsloading(false);
    }
    const toggleZoom = () => {
        setIsZoomed(false)
    }

    const onChange = (e:any) => {
        const inputValue = e.target.value;
        const nftsList = document.getElementsByClassName(
          'nft-card',
        ) as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < nftsList.length; i++) {
          const nftName = nftsList[i].querySelectorAll('.nft-name')[0];
          if (nftName !== undefined) {
            const nftNameText = nftName.innerHTML ;
            if (
              nftNameText.toUpperCase().indexOf(inputValue.toUpperCase()) >
              -1
            ) {
              nftsList[i].style.display = 'flex';
            } else {
              nftsList[i].style.display = 'none';
            }
          }
        }
      }

    if (!isloading && !nfts.length) return (
        <div className="bg-black h-screen">
            <Header background='bg-black' activeMenu="my item" onChange={onChange} isSearchAvailabe={true}/>
            <h1 className="text-3xl text-white flex flex-col justify-center items-center h-full">
                <span className="border-b border-[#ffa503]">You have no Nft available</span>
                <span className="text-[#ffa503] text-sm py-2">
                    <Link href={'/market'}>
                        Go to the market
                    </Link>
                </span>
            </h1>
        </div>
    );
    if (isloading) return (<Loading />);

    return (
        <div className="bg-black">
            <Header background="bg-black" activeMenu="my item" onChange={onChange} isSearchAvailabe={true} />
            <div className="bg-black h-screen overflow-y-auto">
                <div className="mt-32 px-36 lg:mt-5 lg:px-10 xsm:px-5 sm:px-5 xsm:mt-0 sm:mt-0">
                    <h1 className="text-white text-5xl py-10 xsm:py-3 sm:py-3">My NFTs</h1>
                    <div className="2xl:grid 2xl:grid-cols-4 lg:grid lg:grid-cols-3 justify-center gap-5 py-10 xsm:flex xsm:flex-col sm:flex sm:flex-col">
                        {nfts.map((nft, index) => {
                            return (
                                <div
                                    key={index}
                                    className="bg-cyan-900 bg-opacity-50 flex flex-col py-3 px-3 rounded-md border border-[#221a0c] hover:transform hover:scale-105 transition nft-card">
                                    <img src={nft.image} alt="nft-image" className="w-fill rounded-md" />
                                    <div className="text-white py-3">
                                        <p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ffa503] nft-name">{nft.name}</p>
                                        <p className="max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">{nft.description}</p>
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
                    <div className="absolute bg-black bg-opacity-90 top-0 left-0 right-0 bottom-0 flex justify-center items-center"  >
                        <HiOutlinePlus className="text-white absolute right-10 top-10 text-xl rotate-45 cursor-pointer" onClick={toggleZoom} />
                        <Zoom nft={zoomedNft} loadNfts={loadMyNfts} canBuy={false} />
                    </div>
                }
            </div>
        </div>
    );
}

export default MyItems;