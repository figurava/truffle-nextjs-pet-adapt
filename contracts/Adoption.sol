pragma solidity ^0.5.0;

// Solidity is a compiled language.
// We need to compile our Solidity to bytecode for the Ethereum Virtual Machine (EVM) to execute. 
contract Adoption {

    address[16] public adopters; //  an array of Ethereum addresses

    // adopting a pet
    function adopt(uint petId) public returns(uint) {
        require(petId >= 0 && petId < 15); // ensure the ID is within range
        adopters[petId] = msg.sender; // The address of the person or smart contract who called this function is denoted by msg.sender
        return petId;
    }

    // view keyword in the function declaration means that the function will not modify the state of the contract.
    function getAdopters() public view returns (address[16] memory) {
        // Be sure to specify the return type (in this case, the type for adopters) as address[16] memory. 
        // memory gives the data location for the variable
        return adopters;
    }
}