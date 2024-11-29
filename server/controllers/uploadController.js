const {
  storeImages,
  storeTokenUriMetadata,
} = require("../middleware/uploadToPinata");

const metadataTemplate = {
  citizenshipId: "",
  name: "",
  image: "",
};

const uploadFile = async (req, res) => {
  //   console.log(req.body);
  //   console.log(req.files.front[0].fieldname);
  //   console.log(req.files.back[0].fieldname);
  console.log(req.files);
  const response = await handleTokenUri();
  return res.json(response);
};

const handleTokenUri = async () => {
  let tokenUris = [];
  try {
    const { responses: imageUploadResponses, files } = await storeImages();
    for (const index in imageUploadResponses) {
      let tokenUriMetadata = { ...metadataTemplate };
      tokenUriMetadata.name = files[index];
      tokenUriMetadata.image = `ipfs://${imageUploadResponses[index].IpfsHash}`;

      console.log(`Uploading ${tokenUriMetadata.name}`);
      const metadataUploadResponse = await storeTokenUriMetadata(
        tokenUriMetadata
      );
      tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    }
    console.log(tokenUris);
    return { tokenUris };
  } catch (e) {
    console.log(e);
    return { e };
  }
};

module.exports = { uploadFile };
