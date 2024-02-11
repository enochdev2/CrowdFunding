require("@nomicfoundation/hardhat-toolbox");
const ALCHEMY_API_KEY = "762nK8pWEh6o7k5yc2vyEISTGJP-tVIJ";
ALCHEMY_API_HTTP =
  "https://eth-sepolia.g.alchemy.com/v2/762nK8pWEh6o7k5yc2vyEISTGJP-tVIJ";
const SEPOLIA_KEY =
  "80d0652eda2c9cf7bb9206cab5a785d84e23834d20fded581a6b1e8c5de10a33";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_KEY],
    },
    // mumbai: {
    //   // Infura
    //   // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
    //   url: "https://rpc-mumbai.matic.today",
    //   accounts: [privateKey],
    // },
  },
  solidity: "0.8.19",
};
