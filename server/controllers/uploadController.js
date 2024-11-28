const uploadFile = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.json(req.files);
};

module.exports = { uploadFile };
