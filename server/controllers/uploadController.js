const {
  storeImagesToIPFS,
  storeTokenUriMetadataToIPFS,
} = require("../middleware/uploadToPinata");
const { connect, mintNft } = require("./interactSmartContract");

const metadataTemplate = {
  citizenshipId: "",
  name: "",
  frontImage: "",
  backImage: "",
  frontOcrText: "",
  backOcrText: "",
};

const uploadToBlockchain = async (ocrData) => {
  try {
    const response = await getTokenUriFromIPFS(ocrData);
    const { tokenUris } = response;

    if (!tokenUris || tokenUris.length === 0) {
      throw new Error("No token URIs generated");
    }

    await connect();

    for (const token of tokenUris) {
      console.log(`Minting NFT for ID ${token.citizenshipId}...`);
      await mintNft({
        tokenUri: token.ipfshash,
        citizenshipId: token.citizenshipId,
      });
    }

    return tokenUris;
  } catch (err) {
    console.error("Error during uploadToBlockchain:", err);
    return { error: err.message };
  }
};

const getTokenUriFromIPFS = async (ocrData) => {
  let tokenUris = [];

  try {
    const { responses: frontResponses, files: frontFiles } =
      await storeImagesToIPFS("front");
    const { responses: backResponses, files: backFiles } =
      await storeImagesToIPFS("back");

    if (
      frontResponses.length !== backResponses.length ||
      frontResponses.length !== ocrData.front.length ||
      backResponses.length !== ocrData.back.length
    ) {
      throw new Error("Mismatched image and OCR data count");
    }

    for (let i = 0; i < frontResponses.length; i++) {
      let tokenUriMetadata = {
        ...metadataTemplate,
        name: frontFiles[i],
        citizenshipId: i.toString(),
        frontImage: `ipfs://${frontResponses[i].IpfsHash}`,
        backImage: `ipfs://${backResponses[i].IpfsHash}`,
        frontOcrText: JSON.stringify(ocrData.front[i]),
        backOcrText: JSON.stringify(ocrData.back[i]),
      };

      const metadataUploadResponse = await storeTokenUriMetadataToIPFS(
        tokenUriMetadata
      );

      tokenUris.push({
        name: tokenUriMetadata.name,
        citizenshipId: tokenUriMetadata.citizenshipId,
        ipfshash: `ipfs://${metadataUploadResponse.IpfsHash}`,
      });
    }

    return { tokenUris };
  } catch (e) {
    console.error("IPFS metadata error:", e);
    return { error: e.message };
  }
};

module.exports = { uploadToBlockchain };
