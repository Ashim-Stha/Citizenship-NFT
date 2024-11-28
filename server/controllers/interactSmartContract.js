const ethers = require("ethers");
require("dotenv").config();
const { abi, contractAddress } = require("../config/constants");

const connect = async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const accounts = [wallet.address];

    console.log(accounts);
    return res.json(accounts);
  } catch (e) {
    console.log(e);
    return res.json(e);
  }
};

const mintNft = async (req, res) => {
  const { tokenUri, citizenshipId } = req?.body;
  if (!tokenUri && citizenshipId)
    return res.json("Please provide tokenUri and citizenshipId");
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const signer = wallet.address;
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  try {
    const transactionResponse = await contract.mintNft(tokenUri, citizenshipId);
    const receipt = await transactionResponse.wait();

    console.log("Transaction mined:", receipt);
    return res.json(receipt);
  } catch (error) {
    console.log(error);
    return res.json(e);
  }
};

const getTokenByCitizenshipId = async (req, res) => {
  const { citizenshipId } = req?.params;
  if (!citizenshipId) return res.json("Please provide citizenshipId");
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const transactionResponse = await contract.getTokenByCitizenshipId(
      citizenshipId
    );
    return res.json(transactionResponse.toString());
  } catch (e) {
    console.log(e);
    return res.json(e);
  }
};

const getTokenUriByCitizenshipId = async (req, res) => {
  const { citizenshipId } = req?.params;
  if (!citizenshipId) return res.json("Please provide citizenshipId");
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const transactionResponse = await contract.getTokenUriByCitizenshipId(
      citizenshipId
    );
    return res.json(transactionResponse.toString());
  } catch (e) {
    console.log(e);
    return res.json(e);
  }
};

module.exports = {
  connect,
  mintNft,
  getTokenByCitizenshipId,
  getTokenUriByCitizenshipId,
};
