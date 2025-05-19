const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { SerialPort, ReadlineParser } = require("serialport");
const { WebSocketServer } = require("ws"); // WebSocket for real-time communication

const interactSmartContractRoute = require("./routes/smartContractRoute");
const uploadRoute = require("./routes/uploadRoute");
const { storeImagesToIPFS } = require("./middleware/uploadToPinata");
const {
  getTokenUriFromIPFS,
  uploadToBlockchain,
} = require("./controllers/uploadController");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve index.html

// app.use("/", interactSmartContractRoute);
// app.use("/", uploadRoute);yar

// Configure multer for image storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 }); // WebSocket server on port 8080
wss.on("connection", (ws) => {
  console.log("Frontend connected via WebSocket");
});

// Serial Port Communication (Update COM port accordingly)
const arduinoPort = new SerialPort({ path: "COM10", baudRate: 9600 }, (err) => {
  if (err) {
    console.error("Error opening serial port:", err.message);
  } else {
    console.log("Serial port connected on COM10");
  }
});

const readFromArduino = (arduinoPort, wss) => {
  const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\n" }));
  parser.on("data", (data) => {
    console.log("Arduino says:", data.trim());

    if (data.trim() === "NEXT") {
      console.log("Sending 'NEXT' to frontend...");
      wss.clients.forEach((client) => client.send("NEXT")); // Notify frontend
    }
  });
};

// Read data from Arduino
readFromArduino(arduinoPort, wss);

// Endpoint to receive image
app.post("/upload", upload.single("image"), async (req, res) => {
  if (req.body.type === "upload") {
    console.log("Received 'upload' signal — both images are uploaded.");

    // await getTokenUriFromIPFS();
    await uploadToBlockchain();
    return;

    // return res.json({ message: "Upload complete signal received." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  //save to local
  saveToLocal(req);

  // const ocr = uploadToML(image)

  //front
  // const ipfs = uploadToIPFS(ocr,image)
  // const { responses, files, side } = await storeImagesToIPFS(); //front image is stored we get ipfs hash

  //mint token

  // Send ACK signal to Arduino
  sendAckToArduino(arduinoPort);

  res.json({ message: "Image received, ACK sent to Arduino." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const saveToLocal = (req) => {
  const filePath = path.join(
    __dirname,
    "uploads",
    `${req.body.side}- ${req.file.originalname}`
  );
  fs.writeFileSync(filePath, req.file.buffer);
  console.log(`Image saved at: ${filePath}`);
};

const sendAckToArduino = (arduinoPort) => {
  if (arduinoPort.isOpen) {
    arduinoPort.write("ACK\n", (err) => {
      if (err) {
        console.error("Error sending ACK:", err);
      } else {
        console.log("ACK sent to Arduino.");
      }
    });
  }
};
