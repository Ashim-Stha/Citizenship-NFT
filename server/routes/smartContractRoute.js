const express = require("express");
const router = express.Router();
const {
  connect,
  mintNft,
  getTokenByCitizenshipId,
  getTokenUriByCitizenshipId,
} = require("../controllers/interactSmartContract");

router.get("/connect", connect);
router.post("/mintNft", mintNft);
router.get("/getTokenByCitizenshipId/:citizenshipId", getTokenByCitizenshipId);
router.get(
  "/getTokenUriByCitizenshipId/:citizenshipId",
  getTokenUriByCitizenshipId
);

module.exports = router;
