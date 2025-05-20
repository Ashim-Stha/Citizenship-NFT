const axios = require("axios");
const FormData = require("form-data");

async function sendToML(imageBuffer) {
  const form = new FormData();
  form.append("image", imageBuffer, {
    filename: "upload.jpg",
    contentType: "image/jpeg",
  });

  try {
    const response = await axios.post(
      "https://4664-35-243-173-244.ngrok-free.app", // your OCR endpoint
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const ocrResult = response.data;
    console.log("OCR Results:", ocrResult);

    const cleaned = ocrResult.results.map((line) =>
      line.replace(/[\n\f]/g, "").trim()
    );

    console.log("\nCleaned OCR Text:");
    cleaned.forEach((line, i) => {
      console.log(`${i + 1}. ${line}`);
    });

    return cleaned; // ✅ RETURN the cleaned results!
  } catch (err) {
    console.error("Error sending image:", err.response?.data || err.message);
    return null; // Return null on failure
  }
}

module.exports = { sendToML };
