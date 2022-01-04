module.exports = {
  contracts_build_directory : "./public/contracts/",
  // See <https://trufflesuite.com/docs/truffle/reference/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    }
  }
};
