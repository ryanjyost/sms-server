const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  phone: String,
  text: String,
  text_lower: String,
  twilio: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model("logEntry", schema);
