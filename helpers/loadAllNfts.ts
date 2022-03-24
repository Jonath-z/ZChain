import { ethers } from 'ethers';
import {
  nftAddress,
  nftMarketplaceAddress,
} from '../config';
import MARKET from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import axios from 'axios';

const loadAllNFts = async () => {
  const url = process.env.NODE_ENV === "production" ? "https://rinkeby.infura.io/v3/7100c075ab2d434bb74187580c4bb49b" : "http://localhost:8545"
    const provider = new ethers.providers.JsonRpcProvider(url);
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

    return {
        items,
        isloading: false
    }
  };

  export default loadAllNFts