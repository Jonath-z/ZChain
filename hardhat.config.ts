// import { task } from "hardhat/config";
// import "@nomiclabs/hardhat-waffle";

// const readFileSync = require("fs");

// const privateKey = readFileSync(".secret").toString();

// task("accounts", "Prints the list of accounts", async (taskArgs: any, hre: { ethers: { getSigners: () => any; }; }) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// export const networks = {
//   hardhat: {},
//   rinkeby: {
//     url: "https://rinkeby.infura.io/v3/7100c075ab2d434bb74187580c4bb49b",
//     accounts: [privateKey],
//   }
// };
// // eslint-disable-next-line import/no-anonymous-default-export
// export default { solidity: "0.8.4" }

import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";

// const readFileSync = require("fs");
import { readFileSync } from "fs";
const privateKey = readFileSync(".secret").toString();

const config: HardhatUserConfig = {
  networks: {
      hardhat: {},
  rinkeby: {
    url: "https://rinkeby.infura.io/v3/7100c075ab2d434bb74187580c4bb49b",
    accounts: [privateKey],
  }
  },
  solidity: {
    compilers: [{ version: "0.8.4", settings: {} }],
  },
};
export default config;
