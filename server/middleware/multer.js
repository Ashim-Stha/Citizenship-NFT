const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.fieldname}-${file.originalname}-${Date.now()}`);
  },
});

//const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });

module.exports = upload;
