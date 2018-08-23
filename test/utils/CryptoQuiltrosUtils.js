module.exports = function(CryptoQuiltros, accounts) {
    function checkTotalSupply(expectedValue) {
        it('totalSupply debe ser igual a ' + expectedValue, function(done) {
            CryptoQuiltros.deployed().then(function(instance) {
                instance.totalSupply.call().then(function(totalSupply) {
                    assert.equal(totalSupply, expectedValue, 'totalSupply es diferente ' + expectedValue);
                }).then(done).catch(done);
            });
        });
    }

    function checkQuiltroCreation(name) {
        it('createToken debe crear a un quiltro llamado ' + name, function(done) {
            CryptoQuiltros.deployed().then(async function(instance) {
                await instance.createToken(name, { from: accounts[0] }).then(function(result){
                    assert.include(result.logs[0].event, 'TokenCreated', 'no se disparó el evento TokenCreated');
                });
            }).then(done).catch(done);
        });
    }

    return {
        checkTotalSupply: checkTotalSupply,
        checkQuiltroCreation: checkQuiltroCreation,
    }
}

