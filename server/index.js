const express = require("express");
const app = express();
const fs = require("fs");
const {
  connect,
  fund,
  getTokenByCitizenshipId,
  getTokenUriByCitizenshipId,
} = require("./etherss");

app.get("/", async (req, res) => {
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
