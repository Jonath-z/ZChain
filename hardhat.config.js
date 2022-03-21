import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const readFileSync = require("fs");
const privateKey = readFileSync(".secret").toString();

console.log(process.env.PRIVATE_KEY);
console.log('private key ', privateKey);

const config = {
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
