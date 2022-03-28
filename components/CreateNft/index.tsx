import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketplaceAddress } from '../../config';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import MARKET from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import Header from '../Home/_modules/Header';

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: process.env.IPFS_AUTH as string,
  },
});

const CreateNft = () => {
  const [fileUrl, setFileUrl] = useState('');
  const [formInput, setFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const router = useRouter();

  const onChange = async (e: any) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => prog,
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      // console.log(url);
    } catch (e) {
      console.log(e);
    }
  };

  const createItem = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createItemForSale(url);
    } catch (e) {
      console.log(e);
    }
  };

  const createItemForSale = async (url: string) => {
    // console.log(url);
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const createToken = await contract.createToken(url);
    let transaction = await createToken.wait();

    const event = transaction.events[0];
    const tokenId = event.args[2].toNumber();

    // console.log('tokenId', tokenId);

    const price = ethers.utils.parseUnits(formInput.price.trim(), 'ether');

    contract = new ethers.Contract(
      nftMarketplaceAddress,
      MARKET.abi,
      signer
    );

    const listingPrice = await contract.getListingPrice();
    const formatedListingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(
      nftAddress,
      tokenId,
      price,
      {
        value: formatedListingPrice,
      }
    );
    await transaction.wait();
    router.push('/market');
  };

  const search = (e: any) => {
    // console.log(e.target.value);
    return;
  };

  return (
    <>
      <div className="h-screen bg-black">
        <Header
          background="bg-black"
          activeMenu="create nft"
          onChange={search}
          isSearchAvailabe={false}
        />
        <div
          className="flex flex-col w-full
        justify-center 2xl:mt-32 lg:mt-32 items-center"
        >
          <div className="w-96 xsm:w-80 sm:w-80 m-auto">
            <input
              placeholder="Nft Name"
              className="mt-8 border rounded-md p-4 w-full bg-transparent text-white border-[#ffa503]"
              onChange={(e) =>
                setFormInput({ ...formInput, name: e.target.value })
              }
            />
            <textarea
              placeholder="Nft desciption"
              className="mt-2 border rounded p-4 w-full border-[#ffa503] bg-transparent text-white"
              onChange={(e) =>
                setFormInput({
                  ...formInput,
                  description: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="price in ether"
              className="mt-2 border rounded p-4 w-full border-[#ffa503] bg-transparent text-white"
              onChange={(e) =>
                setFormInput({ ...formInput, price: e.target.value })
              }
            />
            <input
              type="file"
              name="nft"
              className="my-4 w-full border py-2 form-control
            block
            px-3
            text-base
            font-normal
            border-[#ffa503] bg-transparent text-white
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:border-[#ffa503] focus:outline-none"
              onChange={onChange}
            />
            {fileUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fileUrl}
                className="rounded mt-4"
                width="130"
                height="130"
                alt="digital art"
              />
            )}
            {fileUrl && (
              <button
                onClick={createItem}
                className="font-bold mt-4 bg-[#ffa503] rounded p-4 shadow-lg w-full hover:bg-[#ffcb62]"
              >
                Create Digital Art
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNft;
