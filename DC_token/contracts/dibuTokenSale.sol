pragma solidity ^0.5.0;
import "./dibuToken.sol";

contract DibuTokenSale {
    address admin;
    DibuToken public tokenContract;
    uint256 public tokenPrice;

    constructor(DibuToken _tokenContract,uint256 _tokenPrice) public {
      admin = msg.sender;
      tokenContract = _tokenContract;
      tokenPrice = _tokenPrice;
    }
}