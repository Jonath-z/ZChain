import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { nftAddress, nftMarketplaceAddress } from '../config';
import MARKET from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const buyNft = async (
  nft: {
    price: string;
    tokenId: any;
  },
  loadNFts: () => void
) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);

  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    nftMarketplaceAddress,
    MARKET.abi,
    signer
  );

  const price = ethers.utils.parseUnits(
    nft.price.toString(),
    'ether'
  );

  try {
    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    loadNFts();
  } catch (e) {
    // console.log(e);
    alert(' Please submit the asking price to complete the purchase');
  }
};

export default buyNft;
