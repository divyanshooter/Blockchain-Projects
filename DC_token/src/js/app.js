App={
    web3Provider:null,
    contracts:{},
    account:"0x0",
    loading:false,
    tokenPrice:1000000000000000,
    tokensSold:0,
    tokensAvailable:750000,
    init:function(){
        console.log('App initialized...');
        return App.initWeb3();
    },
    initWeb3:function(){
        if (typeof web3!=='undefined'){
            App.web3Provider=web3.currentProvider;
            web3= new Web3(web3.currentProvider);

        }
        else {
            App.web3Provider=new Web3.providers.HttpProvider('http://localhost:7545');
            web3=new Web3(App.web3Provider);
        }
  
        return App.initContracts();
    },
    initContracts:function(){
        $.getJSON("DibuTokenSale.json",function(dibuTokenSale){
            App.contracts.DibuTokenSale=TruffleContract(dibuTokenSale);
            App.contracts.DibuTokenSale.setProvider(App.web3Provider);
            App.contracts.DibuTokenSale.deployed().then(async function(dibuTokenSale){
              console.log('Dibu Token Sale Address',dibuTokenSale.address);

            });
        }).done(function(){
                $.getJSON("DibuToken.json",function(dibuToken){
                    App.contracts.DibuToken=TruffleContract(dibuToken);
                    App.contracts.DibuToken.setProvider(App.web3Provider);
                    App.contracts.DibuToken.deployed().then(function(dibuToken){
                      console.log('Dibu Token  Address',dibuToken.address); 
                }); 
                App.listenForEvents();
                return App.render(); 
        });
    });
  },
  listenForEvents:function(){
   App.contracts.DibuTokenSale.deployed().then(function(instance){
       instance.Sell({},{
           fromBlock:0,
           toBlock:'latest',

       }).watch(function(error,event){
           console.log("event Triggered",event);
           App.render();

       })
   })
  },
  render:function(){
      if(App.loading) {
          return;
      }
      App.loading=true;
      var loader=$('#loader');
      var content=$('#content');
      loader.show();
      content.hide();
    var dibuTokenSaleInstance;
    web3.eth.getCoinbase(function(err,account){
        if(err===null){
            console.log(account);
            App.account=account;
            $('#accountAddress').html("Your Account:  "+ account);
        }   
    })
    
    App.contracts.DibuTokenSale.deployed().then(function(instance){
        dibuTokenSaleInstance=instance;
        return instance.tokenPrice();
    }).then(function(tokenPrice){
         App.tokenPrice=tokenPrice;
        console.log(tokenPrice);
        $('.token-price').html(web3.fromWei(App.tokenPrice,"ether").toNumber());
        return dibuTokenSaleInstance.tokenSold();
    }).then(function(tokenSold){
        App.tokensSold=tokenSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
        var progressPercent=(App.tokensSold/App.tokensAvailable)*100;
        $('#progress').css('width',progressPercent+'%');
        App.contracts.DibuToken.deployed().then(function(instance){
            dibuTokenInstance=instance;
            console.log(instance);
            return dibuTokenInstance.balanceOf(App.account);
        }).then(function(balance){
             $('.dibu-balance').html(balance.toNumber());
             App.loading=false;
            loader.hide();
            content.show();
        })
    });
        
    
  },
  buyTokens:function(){
      $('#content').hide();
      $('#loader').show();
      var numberOfTokens=$('#numberOfTokens').val();

      App.contracts.DibuTokenSale.deployed().then(function(instance){
         return instance.buyTokens(numberOfTokens,{
             from:App.account,
             value:numberOfTokens *App.tokenPrice,
             gas:500000
         });
      }).then(function(result){
        console.log("Tokens bought...");
        $('form').trigger('reset');
        $('#content').show();
        $('#loader').hide();
      })

  }
}

$(function(){
    $(window).load(function(){
        App.init();
    });
});