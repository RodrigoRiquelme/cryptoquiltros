require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

const MNEMONIC = process.env.MNENOMIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
    },
    testrpc: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
    },
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/${INFURA_API_KEY}`)
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
    kovan: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://kovan.infura.io/v3/${INFURA_API_KEY}`),
      network_id: 42,
      gas: 3000000,
      gasPrice: 10000000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`),
      network_id: 4,
      gas: 3000000,
      gasPrice: 10000000000
    },
    // main ethereum network(mainnet)
    main: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://mainnet.infura.io/v3/${INFURA_API_KEY}`),
      network_id: 1,
      gas: 3000000,
      gasPrice: 10000000000
    }
  },
};
