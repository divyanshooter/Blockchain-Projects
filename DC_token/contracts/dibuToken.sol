pragma solidity ^0.5.0;

contract DibuToken {
    string public name ="Dibu";
    string public symbol ="dibu";
    string public standard ="Dibu Token v1.0";
    uint256 public totalSupply;
    
    mapping(address=> uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender]=_initialSupply;
        totalSupply=_initialSupply;

    }

}