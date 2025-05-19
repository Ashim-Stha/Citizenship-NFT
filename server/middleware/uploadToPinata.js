const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

const storeImagesToIPFS = async (side) => {
  let responses = [];
  const imagesPath = path.resolve("./uploads/");
  const files = fs.readdirSync(imagesPath);

  const filtered = files
    .filter((file) => file.startsWith(`${side}-`))
    .sort((a, b) => {
      const aIndex = parseInt(a.split("-")[1]);
      const bIndex = parseInt(b.split("-")[1]);
      return aIndex - bIndex;
    });

  console.log(`Uploading ${side} images to IPFS...`);
  for (const file of filtered) {
    console.log(`Working on ${file}`);
    const readableStreamForFile = fs.createReadStream(`${imagesPath}/${file}`);

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (e) {
      console.log(e);
    }
  }

  console.log("-----responses: ", responses);
  console.log(`-----files: ${files}`);
  console.log(`-----side: ${filtered}`);
  return { responses, files: filtered }; // keep sorted filtered names
};

const storeTokenUriMetadataToIPFS = async (metadata) => {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    console.log("------jsonresponse: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
  return null;
};

module.exports = { storeImagesToIPFS, storeTokenUriMetadataToIPFS };
