# CryptoQuiltros

In order to develop this contract the following steps were taken to setup the environment.

Install and run Ganache CLI (formally you would have used TestRPC). Alternatively you can install [Ganache](http://truffleframework.com/ganache/) UI.

```
$ npm install -g ganache-cli
$ ganache-cli
```

When you run Ganache you'll be presented with 10 accounts with private keys. The RPC service that you can interact with the blockchain through is also available on `localhost:8545` for the CLI version and `localhost:7545` for the GUI.

Navigate into the root of this project and install truffle (if you haven't already got it). Run the truffle test command to compile and test the contracts.

```bash
npm install -g truffle
npm run test
npm run dev
```
