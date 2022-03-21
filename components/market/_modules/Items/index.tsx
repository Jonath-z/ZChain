import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from 'axios';
import {
  nftAddress,
  nftMarketplaceAddress,
} from '../../../../config';
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import MARKET from '../../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import Image from 'next/image';

const Items = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    loadNFts();
  }, []);

  const loadNFts = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(
      nftAddress,
      NFT.abi,
      provider
    );
    const marketContract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKET.abi,
      provider
    );

    const data = await marketContract.fetchMarketItems();

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
  };

  const buyNft = async (nft: {
    price: {
      toString: () => ethers.BigNumberish;
    };
    tokenId: any;
  }) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKET.abi,
      signer
    );

    const price = ethers.utils.formatUnits(
      nft.price.toString(),
      'ether'
    );

    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    loadNFts();
  };

  if (!isloading && !nfts.length) return <h1>No Items</h1>;

  return (
    <div>
      {nfts.map((nft, index) => {
        return (
          <div key={index}>
            <Image src={nft.image} alt="nft-image" />
            <div>
              <p>{nft.name}</p>
              <p>{nft.description}</p>
            </div>
            <p>{nft.price} ETH</p>
            <button onClick={() => buyNft(nft)}>Purchace </button>
          </div>
        );
      })}
    </div>
  );
};

export default Items;
