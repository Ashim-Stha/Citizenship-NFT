const express = require("express");
const app = express();

const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { SerialPort } = require("serialport");

const interactSmartContractRoute = require("./routes/smartContractRoute");
const uploadRoute = require("./routes/uploadRoute");
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use("/", interactSmartContractRoute);
// app.use("/", uploadRoute);

// Enable CORS
app.use(cors());

// Configure multer for image storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serial Port Communication Setup (Update COM port accordingly)
const arduinoPort = new SerialPort({ path: "COM10", baudRate: 9600 }, (err) => {
  if (err) {
    console.error("Error opening serial port:", err.message);
  } else {
    console.log("Serial port connected on COM5");
  }
});

// Endpoint to receive image
app.post("/upload", upload.single("image"), async (req, res) => {
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
  } else {
    console.error("Serial port is not open");
  }
});

app.listen(3000, () => {
  console.log("server running");
});
