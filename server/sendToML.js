const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Replace this with the actual path to your image file
const imagePath = path.join(__dirname, "s.png");

// Read the image file from disk
const imageFile = fs.createReadStream(imagePath);

// Create a FormData instance and append the file
// const form = new FormData();
// form.append("image", imageFile);

async function sendToML() {
  const form = new FormData();
  form.append("image", imageFile);
  try {
    const response = await axios.post(
      "https://4664-35-243-173-244.ngrok-free.app", // your OCR server endpoint
      form,
      {
        headers: form.getHeaders(), // sets appropriate Content-Type
      }
    );

    const ocrResult = response.data;
    console.log("OCR Results:", ocrResult);

    // Optional: Clean up the text
    const cleaned = ocrResult.results.map((line) =>
      line.replace(/[\n\f]/g, "").trim()
    );

    console.log("\nCleaned OCR Text:");
    cleaned.forEach((line, i) => {
      console.log(`${i + 1}. ${line}`);
    });
  } catch (err) {
    console.error("Error sending image:", err.response?.data || err.message);
  }
}

module.exports = { sendToML };
