const {
  storeImagesToIPFS,
  storeTokenUriMetadataToIPFS,
} = require("../middleware/uploadToPinata");
const { connect } = require("../routes/smartContractRoute");
const { mintNft } = require("./interactSmartContract");

const metadataTemplate = {
  citizenshipId: "",
  name: "",
  frontImage: "",
  backImage: "",
};

const uploadToBlockchain = async (req, res) => {
  //   console.log(req.body);
  //   console.log(req.files.front[0].fieldname);
  //   console.log(req.files.back[0].fieldname);
  console.log(req.files);
  const response = await getTokenUriFromIPFS();
  console.log(response);
  console.log(response.tokenUris[0].citizenshipId);
  console.log(response.tokenUris[0].ipfshash);
  console.log(response.tokenUris[1].citizenshipId);
  console.log(response.tokenUris[1].ipfshash);
  return res.json(response);

  connect();
  const results = await mintNft({ body: { tokenUri, citizenshipId } });
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

getTokenUriFromIPFS();
module.exports = { uploadToBlockchain };
