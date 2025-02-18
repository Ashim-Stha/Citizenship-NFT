const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { SerialPort, ReadlineParser } = require("serialport");
const { WebSocketServer } = require("ws"); // WebSocket for real-time communication

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve index.html

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

// Read data from Arduino
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\n" }));
parser.on("data", (data) => {
  console.log("Arduino says:", data.trim());

  if (data.trim() === "NEXT") {
    console.log("Sending 'NEXT' to frontend...");
    wss.clients.forEach((client) => client.send("NEXT")); // Notify frontend
  }
});

// Endpoint to receive image
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const filePath = path.join(__dirname, "uploads", req.file.originalname);
  fs.writeFileSync(filePath, req.file.buffer);
  console.log(`Image saved at: ${filePath}`);

  // Send ACK signal to Arduino
  if (arduinoPort.isOpen) {
    arduinoPort.write("ACK\n", (err) => {
      if (err) {
        console.error("Error sending ACK:", err);
      } else {
        console.log("ACK sent to Arduino.");
      }
    });
  }

  res.json({ message: "Image received, ACK sent to Arduino." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
