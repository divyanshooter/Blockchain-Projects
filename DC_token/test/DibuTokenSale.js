const DibuTokenSale=artifacts.require('../contracts/dibuTokenSale.sol');

var tokenSaleInstance;
var tokenPrice=1000000000000000;
contract('DibuTokenSale',function(accounts){
     it('initialises the contract with the correct values',async function(){
       const tokenSaleInstance= await DibuTokenSale.deployed();
       const address=await tokenSaleInstance.address;
       assert.notEqual(address,0x0,'has contract address');
       const tokenContract=await tokenSaleInstance.tokenContract();
       assert.notEqual(tokenContract,0x0,'has token contract address');
       const price=await tokenSaleInstance.tokenPrice();
       assert.equal(price,tokenPrice,'token price is correct');
     })

});