const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function runOCR(imagePath) {
  const form = new FormData();
  form.append("image", fs.createReadStream(imagePath));

  try {
    const response = await axios.post("http://localhost:5000/predict", form, {
      headers: form.getHeaders(),
    });
    return response.data.text;
  } catch (error) {
    console.error(
      "Error from OCR service:",
      error.response?.data || error.message
    );
    return null;
  }
}
