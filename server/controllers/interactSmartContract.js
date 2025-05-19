const ethers = require("ethers");
require("dotenv").config();
const { abi, contractAddress } = require("../config/constants");

// utils/ethConnect.js or similar
const connect = async () => {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Connected wallet:", wallet.address);
    return wallet;
  } catch (e) {
    console.log("Error connecting:", e);
    throw e;
  }
};

module.exports = { connect };

//connect();
const mintNft = async ({ tokenUri, citizenshipId }) => {
  if (!tokenUri || !citizenshipId) {
    throw new Error("Please provide tokenUri and citizenshipId");
  }

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const tx = await contract.mintNft(tokenUri, citizenshipId);
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);
    return receipt;
  } catch (error) {
    console.error("Minting failed:", error);
    throw error;
  }
};

// mintNft();
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
