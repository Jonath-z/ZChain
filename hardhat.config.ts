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
