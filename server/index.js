const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { SerialPort, ReadlineParser } = require("serialport");
const { WebSocketServer } = require("ws");

const { uploadToBlockchain } = require("./controllers/uploadController");
const { sendToML } = require("./sendToML");

let ocrResult;
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("Frontend connected via WebSocket");
});

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
      wss.clients.forEach((client) => client.send("NEXT"));
    }
  });
};
readFromArduino(arduinoPort, wss);

const ocrStore = {
  front: [],
  back: [],
};

app.post("/upload", upload.single("image"), async (req, res) => {
  const { type, side } = req.body;

  if (type === "upload") {
    if (
      ocrStore.front.length !== ocrStore.back.length ||
      ocrStore.front.length === 0
    ) {
      return res.status(400).json({ error: "OCR data mismatch or empty" });
    }

    const mintResult = await uploadToBlockchain(ocrStore);
    ocrStore.front = [];
    ocrStore.back = [];

    return res.json({ message: "NFTs minted", tokenUris: mintResult });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  saveToLocal(req);
  sendAckToArduino(arduinoPort);

  // const ocrResult = await sendToML(req.file.buffer);

  if (side === "front") {
    ocrStore.front.push(ocrResult);
  } else if (side === "back") {
    ocrStore.back.push(ocrResult);
  }

  setTimeout(() => {
    console.log("Sending 'NEXT' to frontend...");
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send("NEXT");
    });
  }, 5000);

  console.log(ocrStore);

  res.json({
    message: "Image received and processed",
    extractedText: ocrResult,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const saveToLocal = (req) => {
  const filePath = path.join(
    __dirname,
    "uploads",
    `${req.body.side}-${req.file.originalname}`
  );
  fs.writeFileSync(filePath, req.file.buffer);
  console.log(`Image saved at: ${filePath}`);
};

const sendAckToArduino = (arduinoPort) => {
  if (arduinoPort.isOpen) {
    arduinoPort.write("ACK\n", (err) => {
      if (err) console.error("Error sending ACK:", err);
      else console.log("ACK sent to Arduino.");
    });
  }
};
