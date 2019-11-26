const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  phone: String
});

module.exports = mongoose.model("user", schema);
