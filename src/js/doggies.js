/* Main Object to manage Contract interactions */
var App = {
  contracts: {},
  CryptoQuiltrosAddress: '0x8292f7272182ADd958E7Cd0B883a4F1E1C2292A2',

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
    var doggyId = parseInt($(event.target.elements).closest('.btn-buy').data('id'));

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      let contractInstance = App.contracts.CryptoQuiltros.at(App.CryptoQuiltrosAddress);
      contractInstance.priceOf(doggyId).then((price) => {
        return contractInstance.purchase(doggyId, {
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

  getQuiltroDetails(doggyId, localAddress) {
    let contractInstance = App.contracts.CryptoQuiltros.at(App.CryptoQuiltrosAddress);
    return contractInstance.getToken(doggyId).then((doggy) => {
      var doggyJson = {
        'doggyId'   : doggyId,
        'doggyName' : doggy[0],
        'doggyDna'  : doggy[1],
        'doggyPrice': web3.fromWei(doggy[2]).toNumber(),
        'doggyNextPrice': web3.fromWei(doggy[3]).toNumber(),
        'ownerAddress': doggy[4]
      }
      if (doggyJson.ownerAddress !== localAddress) {
        loadDoggy(
          doggyJson.doggyId,
          doggyJson.doggyName,
          doggyJson.doggyDna,
          doggyJson.doggyPrice,
          doggyJson.doggyNextPrice,
          doggyJson.ownerAddress,
          false
        );
      } else {
        loadDoggy(
          doggyJson.doggyId,
          doggyJson.doggyName,
          doggyJson.doggyDna,
          doggyJson.doggyPrice,
          doggyJson.doggyNextPrice,
          doggyJson.ownerAddress,
          true
        );
      }
    }).catch(err => {
      console.log(err.message);
    });
  },

  bindEvents() {
    $(document).on('submit', 'form.doggy-purchase', App.handlePurchase);
  }

};

/* Generates a Doggy image based on Doggy DNA */
function generateDoggyImage(doggyId, size, canvas){
  size = size || 10;
  var data = doggyidparser(doggyId);
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


function loadDoggy(doggyId, doggyName, doggyDna, doggyPrice, doggyNextPrice, ownerAddress, locallyOwned) {
  var cardRow = $('#card-row');
  var cardTemplate = $('#card-template');

  if (locallyOwned) {
    cardTemplate.find('.btn-buy').attr('disabled', true);
  } else {
    cardTemplate.find('.btn-buy').removeAttr('disabled');
  }

  cardTemplate.find('.doggy-name').text(doggyName);
  cardTemplate.find('.doggy-canvas').attr('id', 'doggy-canvas-' + doggyId);
  cardTemplate.find('.doggy-dna').text(doggyDna);
  cardTemplate.find('.doggy-owner').text(ownerAddress);
  cardTemplate.find('.doggy-owner').attr('href' + 'http://etherscan.io/address/' + ownerAddress);
  cardTemplate.find('.btn-buy').attr('data-id', doggyId);
  cardTemplate.find('.doggy-price').text(parseFloat(doggyPrice).toFixed(4));
  cardTemplate.find('.doggy-next-price').text(parseFloat(doggyNextPrice).toFixed(4));

  cardRow.append(cardTemplate.html());
  generateDoggyImage(doggyDna, 3, 'doggy-canvas-' + doggyId);
}

/* Called When Document has loaded */
jQuery(document).ready(
  function ($) {
		App.init();
		loadDoggy(0, 'Steve', '0x003f04e2e4', '0.100', '0.200', '00x003f04e2e467', false)
  }
);
