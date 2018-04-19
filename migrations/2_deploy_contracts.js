var CryptoDoggies = artifacts.require('Cryptodoggies.sol');

module.exports = function (deployer) {
    deployer.deploy(CryptoDoggies);
}