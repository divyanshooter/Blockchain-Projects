var DibuToken=artifacts.require('../contracts/dibuToken.sol');

contract('DibuToken',function(accounts) {
    var tokenInstance;
    it('initialises the contract with the correct values',function(){
        return DibuToken.deployed().then(function(instance){
            tokenInstance=instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,'Dibu','has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,'dibu','has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard,'Dibu Token v1.0','has the correct standard');
        })

    })
    it('sets the total supply upon deployment',function(){
       return DibuToken.deployed().then(function(instance){
           tokenInstance=instance;
           return tokenInstance.totalSupply();
       }).then(function(totalSupply){
          assert.equal(totalSupply.toNumber(),1000000,'sets the total to 1,000,000');
          return tokenInstance.balanceOf(accounts[0]);
       }).then(function(adminBalance){
          assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to the admin');
       });
    });
})
