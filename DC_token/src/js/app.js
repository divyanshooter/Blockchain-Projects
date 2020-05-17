App={
    web3Provider:null,
    contracts:{},
    account:"0x0",
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
        $.getJSON("dibuTokenSale.json",function(dibuTokenSale){
            App.contracts.DibuTokenSale=TruffleContract(dibuTokenSale);
            App.contracts.DibuTokenSale.setProvider(App.web3Provider);
            App.contracts.DibuTokenSale.deployed().then(function(dibuTokenSale){
              console.log('Dibu Token Sale Address',dibuTokenSale.address);
            });
        }).done(function(){
                $.getJSON("DibuToken.json",function(dibuToken){
                    App.contracts.DibuToken=TruffleContract(dibuToken);
                    App.contracts.DibuToken.setProvider(App.web3Provider);
                    App.contracts.DibuToken.deployed().then(function(dibuToken){
                      console.log('Dibu Token  Address',dibuToken.address); 
                }); 
                return App.render(); 
        });
    });
  },
  render:function(){
    web3.eth.getCoinbase(function(err,account){
        if(err===null){
            console.log(account);
            App.account=account;
            $('#accountAddress').html("Your Account:  "+ account);
        }   
    })
  }
}

$(function(){
    $(window).load(function(){
        App.init();
    });
});