const {
  storeImagesToIPFS,
  storeTokenUriMetadataToIPFS,
} = require("../middleware/uploadToPinata");
const { connect } = require("../routes/smartContractRoute");
const { mintNft } = require("./interactSmartContract");

const metadataTemplate = {
  citizenshipId: "",
  name: "",
  image: "",
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
  let imageMap = { citizenshipId: { front, back } };
  try {
    const {
      responses: imageUploadResponses,
      files,
      side,
    } = await storeImagesToIPFS();
    if (side === "front") {
    }
    for (const index in imageUploadResponses) {
      let tokenUriMetadata = { ...metadataTemplate };
      tokenUriMetadata.name = files[index];
      tokenUriMetadata.citizenshipId = index;
      tokenUriMetadata.image = `ipfs://${imageUploadResponses[index].IpfsHash}`;

      console.log(`Uploading ${tokenUriMetadata.name}`);
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
    console.log(e);
    return { e };
  }
};

module.exports = { uploadToBlockchain };
