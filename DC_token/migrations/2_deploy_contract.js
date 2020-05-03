const DibuToken = artifacts.require("DibuToken");

module.exports = function(deployer) {
  deployer.deploy(DibuToken,1000000);
};
