import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketplaceAddress } from '../../config';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import MARKET from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import Header from '../Home/_modules/Header';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

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
  const [filePreviewName, setFilePreviewName] = useState('');
  const [progress, setProgress] = useState(0);
  const [isOnTransaction, setIsOnTransaction] = useState(false);
  const router = useRouter();

  const calculFileUploadProgress = (
    totalSize: number,
    currentProgress: number
  ) => {
    const uploadProgress = (currentProgress * 100) / totalSize;
    return uploadProgress;
  };

  const onChange = async (e: any) => {
    const file = e.target.files[0];
    setFilePreviewName(file.name);
    console.log(file.name);
    try {
      const added = await client.add(file, {
        progress: (prog) => {
          setProgress(calculFileUploadProgress(file.size, prog));
        },
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  };

  const createItem = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    setIsOnTransaction(!isOnTransaction);
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
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const createToken = await contract.createToken(url);
    let transaction = await createToken.wait();

    const event = transaction.events[0];
    const tokenId = event.args[2].toNumber();

    const price = ethers.utils.parseUnits(
      formInput.price.trim(),
      'ether'
    );

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
    setIsOnTransaction(!isOnTransaction);
    router.push('/market');
  };

  const onOpenFileClick = () => {
    document.getElementById('input-file')?.click();
  };

  const search = (e: any) => {
    // console.log(e.target.value);
    return;
  };

  return (
    <>
      <div className="h-screen bg-black overflow-auto pb-10">
        <Header
          background="bg-black"
          activeMenu="create nft"
          onChange={search}
          isSearchAvailabe={false}
        />
        <div className="flex justify-center items-center w-full h-full xsm:flex-col sm:flex-col">
          <div>
            {fileUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fileUrl}
                className="rounded mx-3 w-fit h-96"
                alt="digital art"
              />
            )}
          </div>
          <div
            className="flex flex-col
        justify-center items-center"
          >
            {/* 2xl:mt-32 lg:mt-32 */}
            <div className="w-96 xsm:w-80 sm:w-80 m-auto">
              <input
                placeholder="Nft Name"
                className="mt-0 border rounded-md p-4 w-full bg-transparent text-white border-[#ffa503]"
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
                  setFormInput({
                    ...formInput,
                    price: e.target.value,
                  })
                }
              />
              <input
                type="file"
                id="input-file"
                name="nft"
                className="hidden"
                onChange={onChange}
              />
              <div
                onClick={onOpenFileClick}
                className="border-2 border-dashed py-2 bg-[#643f00] bg-opacity-30 text-white text-center mt-3 cursor-pointer hover:bg-opacity-50 transition"
              >
                {filePreviewName ? (
                  filePreviewName
                ) : (
                  <p>
                    chose{' '}
                    <span className="text-[#ffa503]">file </span>
                  </p>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div
                  className="bg-[#ffa503] mt-3 h-1.5 rounded-full dark:bg-gray-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {fileUrl && (
                <button
                  onClick={createItem}
                  className="font-bold mt-4 bg-[#ffa503] rounded p-4 shadow-lg w-full hover:bg-[#ffcb62]"
                >
                  {isOnTransaction ? (
                    <p className="flex justify-center items-center">
                      <span className="animate-spin mx-2">
                        {' '}
                        <AiOutlineLoading3Quarters />
                      </span>{' '}
                      Pending{' '}
                    </p>
                  ) : (
                    <span>Create Digital Art</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNft;
