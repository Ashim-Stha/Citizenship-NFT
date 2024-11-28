const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { uploadFile } = require("../controllers/uploadController");

router.post(
  "/upload",
  //  upload.single("citizenship"),
  upload.fields([{ name: "front" }, { name: "back" }]),
  uploadFile
);

module.exports = router;
