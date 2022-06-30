import Web3 from "web3";
import ContractJson from "../contracts/VaccineVerification.json";

let contract;

let fetched = false;

function getSmartContract() {
  if (!fetched) {
    const web3 = new Web3("http://localhost:7545");
    contract = new web3.eth.Contract(
      ContractJson.abi,
      ContractJson.networks[5777].address
    );
    fetched = true;
  }
  return contract;
}

export function useSmartContract() {
  function retrieveRecord(account, amount) {
    return new Promise((resolve, reject) => {
      // do something asynchronous
      getSmartContract()
        .methods.getHash()
        .send({ from: account, value: amount })
        .once("receipt", (receipt) => {
          console.log("receipt after getHash:", receipt);
          resolve(receipt.events.fileHash.returnValues.returnedHash);
        });
    });
  }

  function addRecord(account, hash, address) {
    console.log(
      "hash user_address health_provider_address",
      hash,
      address,
      account
    );
    getSmartContract().methods.storeHash(hash, address).send({ from: account });
  }

  return { retrieveRecord, addRecord };
}
