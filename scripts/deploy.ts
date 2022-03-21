import { ethers } from "hardhat";

async function main() {
  const NftMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await NftMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const Nft = await ethers.getContractFactory("NFT");
  const nft = await Nft.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
