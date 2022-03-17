require("@nomiclabs/hardhat-waffle");
import { readFileSync } from 'fs';

const privateKey = readFileSync(".secret").toString();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export const networks = {
  hardhat: {},
  rinkeby: {
    url: "https://rinkeby.infura.io/v3/7100c075ab2d434bb74187580c4bb49b",
    accounts: [privateKey],
  }
};
export const solidity = "0.8.4";
