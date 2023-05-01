<div align = "center">
    <h1>CryptoQuiltros<em> DApp</em></h1>
    <p>Purchase your favorite quiltro puppies on the blockchain.</p>
    <a href="https://www.ethereum.org/" target="_blank"><img src="https://img.shields.io/badge/Ethereum-ETH-blue.svg" alt="Ethereum"></a>
    <a href="https://solidity.readthedocs.io" target="_blank"><img src="https://img.shields.io/badge/Solidity-%5E0.4.18-blue.svg" alt="Solidity"></a>
    <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-%5E9.2.0-blue.svg" alt="Node.js"></a>
    <a href="https://travis-ci.org/RodrigoRiquelme/cryptoquiltros" target="_blank"><img src="https://travis-ci.org/RodrigoRiquelme/cryptoquiltros.svg?branch=master" alt="Build Status"></a>
    <a href="https://coveralls.io/github/RodrigoRiquelme/cryptoquiltros?branch=master"><img src="https://coveralls.io/repos/github/RodrigoRiquelme/cryptoquiltros/badge.svg?branch=master" alt="Coverage Status" /></a>
</div>
<h3>Ambientación</h3>

To lift a local dev environment you must follow the next steps.

Install Ganache CLI. As alternative you can install [Ganache](http://truffleframework.com/ganache/) UI.

```
$ npm install -g ganache-cli
$ ganache-cli
```

Ganache will create 10 Ethereum accounts on a local blockchain. The RPC service to interact with it es `localhost:8545` para la versión CLI y `localhost:7545` para el GUI.

Install Truffle. use the command `ganache test` to compile and execute the tests.

```bash
npm install -g truffle
npm run test
npm run dev
```

Ropsten Testnet Criptoquiltros (CQTS)
https://ropsten.etherscan.io/token/0x8292f7272182add958e7cd0b883a4f1e1c2292a2
