const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

const storeImagesToIPFS = async () => {
  let responses = [];
  let side;
  const imagesPath = path.resolve("./uploads/");
  if (imagesPath[0].includes("front")) {
    side = "front";
  } else {
    side = "back";
  }
  const files = fs.readdirSync(imagesPath);
  console.log("Uploading to IPFS...");
  for (const file in files) {
    console.log(`Working on ${file}`);
    // const fullFilePath = path.join(imagesPath, file); // Full path to the file

    const readableStreamForFile = fs.createReadStream(
      `${imagesPath}/${files[file]}`
    );

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);
    } catch (e) {
      console.log(e);
    }
  }

  return { responses, files, side };
};

const storeTokenUriMetadataToIPFS = async (metadata) => {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (e) {
    console.log(e);
  }
  return null;
};

module.exports = { storeImagesToIPFS, storeTokenUriMetadataToIPFS };
