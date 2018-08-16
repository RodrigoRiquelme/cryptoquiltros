/* Main Object to manage Contract interactions */
var App = {
  contracts: {},
  CryptoQuiltrosAddress: '0x39443E56E1E5e01Cb66728495B9B2C6D3f3c26CE',

  init() {
    return App.initWeb3();
	},

  initWeb3() {
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
    return App.initContract();
  },

  initContract() {
    $.getJSON('cryptoQuiltros.json', (data) => {
      const CryptoQuiltrosArtifact = data;
      App.contracts.CryptoQuiltros = TruffleContract(CryptoQuiltrosArtifact);
      App.contracts.CryptoQuiltros.setProvider(web3.currentProvider);
      return App.loadQuiltros();
    });
    return App.bindEvents();
  },

  handlePurchase(event) {
    event.preventDefault();
    var quiltroId = parseInt($(event.target.elements).closest('.btn-buy').data('id'));

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      let contractInstance = App.contracts.CryptoQuiltros.at(App.CryptoQuiltrosAddress);
      contractInstance.priceOf(quiltroId).then((price) => {
        return contractInstance.purchase(quiltroId, {
          from: account,
          value: price
        }).then(result => App.loadQuiltros()).catch((err) => {
          console.log(err.message);
        })
      });
    });
  },

  loadQuiltros() {
    web3.eth.getAccounts(function (err, accounts) {
      if (err != null) {
        console.error('Ha ocurrido un error ' + err);
      } else if (accounts.length === 0) {
        console.log('Usuario no logueado a Metamask');
      } else {
        $('#card-row').children().remove();
      }
    });

    var address = web3.eth.defaultAccount;
    let contractInstance = App.contracts.CryptoQuiltros.at(App.CryptoQuiltrosAddress);
    return totalSupply = contractInstance.totalSupply().then((supply) => {
      for (var i = 0; i < supply; i++) {
        App.getQuiltroDetails(i, address);
      }
    }).catch((err) => {
      console.log(err.message);
    });
  },

  getQuiltroDetails(quiltroId, localAddress) {
    let contractInstance = App.contracts.CryptoQuiltros.at(App.CryptoQuiltrosAddress);
    return contractInstance.getToken(quiltroId).then((quiltro) => {
      var quiltroJson = {
        'quiltroId'   : quiltroId,
        'quiltroName' : quiltro[0],
        'quiltroDna'  : quiltro[1],
        'quiltroPrice': web3.fromWei(quiltro[2]).toNumber(),
        'quiltroNextPrice': web3.fromWei(quiltro[3]).toNumber(),
        'ownerAddress': quiltro[4]
      }
      if (quiltroJson.ownerAddress !== localAddress) {
        loadQuiltro(
          quiltroJson.quiltroId,
          quiltroJson.quiltroName,
          quiltroJson.quiltroDna,
          quiltroJson.quiltroPrice,
          quiltroJson.quiltroNextPrice,
          quiltroJson.ownerAddress,
          false
        );
      } else {
        loadQuiltro(
          quiltroJson.quiltroId,
          quiltroJson.quiltroName,
          quiltroJson.quiltroDna,
          quiltroJson.quiltroPrice,
          quiltroJson.quiltroNextPrice,
          quiltroJson.ownerAddress,
          true
        );
      }
    }).catch(err => {
      console.log(err.message);
    });
  },

  bindEvents() {
    $(document).on('submit', 'form.quiltro-purchase', App.handlePurchase);
  }

};

/* Generates a Quiltro image based on Quiltro DNA */
function generateQuiltroImage(quiltroId, size, canvas){
  size = size || 10;
  var data = doggyidparser(quiltroId);
  var canvas = document.getElementById(canvas);
  canvas.width = size * data.length;
  canvas.height = size * data[1].length;
  var ctx = canvas.getContext("2d");

  for(var i = 0; i < data.length; i++){
      for(var j = 0; j < data[i].length; j++){
          var color = data[i][j];
          if(color){
          ctx.fillStyle = color;
          ctx.fillRect(i * size, j * size, size, size);
          }
      }
  }
  return canvas.toDataURL();
}


function loadQuiltro(quiltroId, quiltroName, quiltroDna, quiltroPrice, quiltroNextPrice, ownerAddress, locallyOwned) {
  var cardRow = $('#card-row');
  var cardTemplate = $('#card-template');

  if (locallyOwned) {
    cardTemplate.find('.btn-buy').attr('disabled', true);
  } else {
    cardTemplate.find('.btn-buy').removeAttr('disabled');
  }

  cardTemplate.find('.quiltro-name').text(quiltroName);
  cardTemplate.find('.quiltro-canvas').attr('id', 'quiltro-canvas-' + quiltroId);
  cardTemplate.find('.quiltro-dna').text(quiltroDna);
  cardTemplate.find('.quiltro-owner').text(ownerAddress);
  cardTemplate.find('.quiltro-owner').attr('href' + 'http://etherscan.io/address/' + ownerAddress);
  cardTemplate.find('.btn-buy').attr('data-id', quiltroId);
  cardTemplate.find('.quiltro-price').text(parseFloat(quiltroPrice).toFixed(4));
  cardTemplate.find('.quiltro-next-price').text(parseFloat(quiltroNextPrice).toFixed(4));

  cardRow.append(cardTemplate.html());
  generateQuiltroImage(quiltroDna, 3, 'quiltro-canvas-' + quiltroId);
}

/* Called When Document has loaded */
jQuery(document).ready(
  function ($) {
		App.init();
		loadQuiltro(0, 'Steve', '0x003f04e2e4', '0.100', '0.200', '00x003f04e2e467', false)
  }
);
