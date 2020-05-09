const DibuToken = artifacts.require("DibuToken");
const DibuTokenSale=artifacts.require("DibuTokenSale")

module.exports = function(deployer) {
   deployer.deploy(DibuToken,1000000).then((result)=>{
     var tokenPrice=1000000000000000;
     return deployer.deploy(DibuTokenSale,result.address,tokenPrice);
   });
  
};
