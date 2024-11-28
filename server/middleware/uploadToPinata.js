const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

const storeImages = async () => {
  let responses = [];
  const imagesPath = path.resolve(__dirname, "..", "./uploads");
  const files = fs.readdirSync(imagesPath);
  console.log("Uploading to IPFS...");
  for (const file in files) {
    console.log(`Working on ${file}`);
    const readableStreamForFile = fs.createReadStream(`${imagesPath}/${file}`);

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (e) {
      console.log(e);
    }
  }

  return { responses, files };
};

const storeTokenUriMetadata = async (metadata) => {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (e) {
    console.log(e);
  }
  return null;
};

module.exports = { storeImages, storeTokenUriMetadata };
