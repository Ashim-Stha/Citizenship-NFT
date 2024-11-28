const ethers = require("ethers");
require("dotenv").config();
const { abi, contractAddress } = require("./constants");

const connect = async () => {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const accounts = [wallet.address];

    console.log(accounts);
    return { accounts };
  } catch (e) {
    console.log(e);
    return { e };
  }
};

async function fund() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const signer = wallet.address;
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  try {
    const transactionResponse = await contract.mintNft("chandrey", "17");
    const receipt = await transactionResponse.wait();

    console.log("Transaction mined:", receipt);
    return { receipt };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

const getTokenByCitizenshipId = async (citizenshipId) => {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const transactionResponse = await contract.getTokenByCitizenshipId(
      citizenshipId
    );
    // const receipt = await transactionResponse.wait(1);
    //console.log(receipt);
    return transactionResponse.toString();
  } catch (e) {
    console.log(e);
    return { e };
  }
};

const getTokenUriByCitizenshipId = async (citizenshipId) => {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const transactionResponse = await contract.getTokenUriByCitizenshipId(
      citizenshipId
    );
    // const receipt = await transactionResponse.wait(1);
    //console.log(receipt);
    return transactionResponse.toString();
  } catch (e) {
    console.log(e);
    return { e };
  }
};

module.exports = {
  connect,
  fund,
  getTokenByCitizenshipId,
  getTokenUriByCitizenshipId,
};
