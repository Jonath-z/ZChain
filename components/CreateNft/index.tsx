import React, { useState } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import { create as ipfsHttpClient, Options } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketplaceAddress } from '../../config';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import MARKET from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const client = ipfsHttpClient({ 
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: '7100c075ab2d434bb74187580c4bb49b'
  }
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
        progress: (prog) => console.log('received', prog, '%'),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      console.log(url);
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
      // console.log(url);
    } catch (e) {
      console.log(e);
    }
  };

  const createItemForSale = async (url: string) => {
    console.log(url);
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
  

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const createToken = await contract.createToken(url);
    let transaction = await createToken.wait();

    const event = transaction.events[0];
    const tokenId = event.args[2].toNumber();

    console.log('tokenId', tokenId);

    const price = ethers.utils.parseUnits(formInput.price, 'ether');

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

  return (
    <div>
      <input
        placeholder="Nft Name"
        className="mt-8 border rounded-md p-4"
        onChange={(e) =>
          setFormInput({ ...formInput, name: e.target.value })
        }
      />
      <textarea
        placeholder="Nft desciption"
        className="mt-2 border rounded p-4"
        onChange={(e) =>
          setFormInput({ ...formInput, description: e.target.value })
        }
      />
      <input
        placeholder="price in ether"
        className="mt-2 border rounded p-4"
        onChange={(e) =>
          setFormInput({ ...formInput, price: e.target.value })
        }
      />
      <input
        type="file"
        name="nft"
        className="my-4"
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
      <button
        onClick={createItem}
        className="font-bold mt-4 bg-[#ffa503] rounded p-4 shadow-lg"
      >
        Create Digital Art
      </button>
    </div>
  );
};

export default CreateNft;
