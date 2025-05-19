const {
  storeImagesToIPFS,
  storeTokenUriMetadataToIPFS,
} = require("../middleware/uploadToPinata");
const { connect } = require("./interactSmartContract");
const { mintNft } = require("./interactSmartContract");

const metadataTemplate = {
  citizenshipId: "",
  name: "",
  frontImage: "",
  backImage: "",
};

const uploadToBlockchain = async () => {
  try {
    // Step 1: Upload images and metadata to IPFS
    const response = await getTokenUriFromIPFS();
    const { tokenUris } = response;

    if (!tokenUris || tokenUris.length === 0) {
      return res.status(500).json({ error: "No token URIs generated" });
    }

    // Step 2: Connect to smart contract
    await connect();

    // Step 3: Mint NFTs for each token URI
    for (const token of tokenUris) {
      console.log(`Minting NFT for ID ${token.citizenshipId}...`);
      await mintNft({
        tokenUri: token.ipfshash, // this is the correct field from tokenUris
        citizenshipId: token.citizenshipId,
      });
    }

    return tokenUris;

    // Step 4: Return all minted tokens
    // res.json({ message: "Minting complete", tokenUris });
  } catch (err) {
    console.error("Error during uploadToBlockchain:", err);
    // res.status(500).json({ error: "Minting failed", details: err.message });
    return err.message;
  }
};

const getTokenUriFromIPFS = async () => {
  let tokenUris = [];

  try {
    const { responses: frontResponses, files: frontFiles } =
      await storeImagesToIPFS("front");
    const { responses: backResponses, files: backFiles } =
      await storeImagesToIPFS("back");

    if (frontResponses.length !== backResponses.length) {
      throw new Error("Mismatched front and back images count");
    }

    for (let i = 0; i < frontResponses.length; i++) {
      let tokenUriMetadata = {
        ...metadataTemplate,
        name: frontFiles[i], // or just the base name without prefix
        citizenshipId: i.toString(),
        frontImage: `ipfs://${frontResponses[i].IpfsHash}`,
        backImage: `ipfs://${backResponses[i].IpfsHash}`,
      };

      console.log(`Uploading metadata for ${tokenUriMetadata.name}`);
      const metadataUploadResponse = await storeTokenUriMetadataToIPFS(
        tokenUriMetadata
      );

      tokenUris.push({
        name: tokenUriMetadata.name,
        citizenshipId: tokenUriMetadata.citizenshipId,
        ipfshash: `ipfs://${metadataUploadResponse.IpfsHash}`,
      });
    }

    console.log("----------------TOKENURIS: ", tokenUris);
    return { tokenUris };
  } catch (e) {
    console.log(e);
    return { e };
  }
};

//getTokenUriFromIPFS();
module.exports = { uploadToBlockchain, getTokenUriFromIPFS };
