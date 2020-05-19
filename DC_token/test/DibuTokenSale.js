const DibuToken=artifacts.require('../contracts/dibuToken.sol');
const DibuTokenSale=artifacts.require('../contracts/dibuTokenSale.sol');

contract('DibuTokenSale',function(accounts){
  
     var tokenSaleInstance;
     var admin=accounts[0];
     var buyer=accounts[1];
     var numberOfTokens;
     var tokenPrice=1000000000000000;
     var tokensAvailable=750000;

     it('initialises the contract with the correct values',async function(){
       const tokenSaleInstance= await DibuTokenSale.deployed();
       const address=await tokenSaleInstance.address;
       assert.notEqual(address,0x0,'has contract address');
       const tokenContract=await tokenSaleInstance.tokenContract();
       assert.notEqual(tokenContract,0x0,'has token contract address');
       const price=await tokenSaleInstance.tokenPrice();
       console.log(price.toNumber());
       assert.equal(price,tokenPrice,'token price is correct');
     });

     it('facilitates token buying',async function(){
      const tokenInstance= await DibuToken.deployed();
      const tokenSaleInstance= await DibuTokenSale.deployed();
      await tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable,{from:admin});
      numberOfTokens=10; 
      const receipt=await tokenSaleInstance.buyTokens(numberOfTokens,{from:buyer,value:numberOfTokens * tokenPrice});
      assert.equal(receipt.logs.length,1,'triggers one event');
      assert.equal(receipt.logs[0].event,'Sell','should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer,buyer,'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount,numberOfTokens,'logs the number of token purchased');
      const amount= await tokenSaleInstance.tokenSold();
      assert.equal(amount.toNumber(),numberOfTokens,'increments the number of tokens sold');
      const balance = await tokenInstance.balanceOf(tokenSaleInstance.address);
      assert.equal(balance.toNumber(),tokensAvailable-numberOfTokens,'tokens deducted from the tokenSale contract');
      const buyerBalance =await tokenInstance.balanceOf(buyer);
      assert.equal(buyerBalance.toNumber(),numberOfTokens,'token are added to buyer');      
      try{
         await tokenSaleInstance.buyTokens(numberOfTokens,{from:buyer,value:1});
         assert.fail();
      }
      catch(error){
        assert(error.message.indexOf('revert')>=0, 'msg.value must equal number of token in wei');
      }
      try{
         await tokenSaleInstance.buyTokens(800000,{from:buyer,value:1});
         assert.fail();
      }
      catch(error){
        assert(error.message.indexOf('revert')>=0, 'cannot purchase more than available');
      }
       
     }); 

     it('end token sale', async function(){
      const tokenInstance= await DibuToken.deployed();
      tokenSaleInstance= await DibuTokenSale.deployed();
      try{
        await tokenSaleInstance.endSale({from:buyer});
        assert.fail();

      }
      catch(error){
        assert(error.message.indexOf('revert')>=0, 'must be admin to end Sale');
      }
      var receipt=await tokenSaleInstance.endSale({from:admin});
      const balance=await tokenInstance.balanceOf(admin);
      assert.equal(balance.toNumber(),999990,'returns all unsold dibu tokens to admin');

      
     });

});