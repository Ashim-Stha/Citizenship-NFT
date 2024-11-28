const express = require("express");
const app = express();
const fs = require("fs");
const {
  connect,
  fund,
  getTokenByCitizenshipId,
  getTokenUriByCitizenshipId,
} = require("./etherss");
const multer = require("multer");

//app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
//const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });

app.post(
  "/file",
  //  upload.single("citizenship"),
  upload.fields([{ name: "front" }, { name: "back" }]),
  (req, res) => {
    console.log(req.body);
    console.log(req.files);
    res.send(req.files);
  }
);

app.get("/connect", async (req, res) => {
  const result = await connect();
  res.json(result);
});

app.get("/fund", async (req, res) => {
  const result = await fund("0.1");
  res.json(result);
});

app.get("/getTokenByCitizenshipId", async (req, res) => {
  const result = await getTokenByCitizenshipId("17");
  res.json(result);
});

app.get("/getTokenUriByCitizenshipId", async (req, res) => {
  const result = await getTokenUriByCitizenshipId("17");
  res.json(result);
});
app.listen(3000, () => {
  console.log("server running");
});
