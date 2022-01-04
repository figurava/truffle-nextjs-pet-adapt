import Web3 from 'web3';
import axios from 'axios';
import TruffleContract from 'truffle-contract';

export default {
  web3: null,
  web3Provider: null,
  contracts: {},
  emitUpdate : null,

  initWeb3: async function(emitUpdate) {
    this.emitUpdate = emitUpdate;
    // Modern dapp browsers...
    if (window.ethereum) {
      this.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    this.web3 = new Web3(this.web3Provider);

    // Get the necessary contract artifact file and instantiate it with @truffle/contract
    axios.get('/contracts/Adoption.json').then((response)=> {
      this.initContract(response.data);
    });

  },

  initContract(AdoptionArtifact) {
      this.contracts.Adoption = TruffleContract(AdoptionArtifact);
      // Set the provider for our contract
      this.contracts.Adoption.setProvider(this.web3Provider);
      // Use our contract to retrieve and mark the adopted pets
      return this.retrieveAdopters();
  },

  retrieveAdopters() {
    var adoptionInstance;
    this.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        // Using call() allows us to read data from the blockchain without having to send a full transaction, meaning we won't have to spend any ether.
        return adoptionInstance.getAdopters.call();
      }).then((adopters) => {
        this.emitUpdate({adopters: adopters});
      }).catch(function(err) {
        // console.log(err.message);
      });
  },

  handleAdopt(petId) {

    var adoptionInstance;

    this.web3.eth.getAccounts((error, accounts) =>{
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      this.contracts.Adoption.deployed().then((instance)  =>{
        adoptionInstance = instance;
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then((result) =>{
        return this.retrieveAdopters();
      }).catch(function(err) {
        alert(err.message);
      });
    });
  }

};
