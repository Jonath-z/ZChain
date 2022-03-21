import { ethers } from "hardhat";
import chai from 'chai';
import { solidity } from "ethereum-waffle";

chai.use(solidity);import "hardhat-typechain"; 
const { expect } = chai;

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('0.0029', 'ether');

    await nft.createToken("https://mytoken.com");
    await nft.createToken("https://mytoken.com");

    await market.createMarketItem(nftAddress, 1, auctionPrice, { value: listingPrice });
    await market.createMarketItem(nftAddress, 2, auctionPrice, { value: listingPrice });

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftAddress, 1, { value: auctionPrice });
    let items = await market.fetchMarketItems();
    items = await Promise.all(items.map(async (i: any) => {
      const tokenURI = await nft.tokenURI(i.tokenId);
      const item = {
        price: i.price.toString(),
        tokenID: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenURI
      }
      return item;
    }))

    console.log('items:', items);

  });
});
