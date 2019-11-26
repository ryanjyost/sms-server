const express = require("express");
const util = require("util");
const router = express.Router();
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const LogEntry = require("../models/logEntry");
const User = require("../models/user");

/* GET home page. */

const accountSid = process.env.TwilioAccountSid;
const authToken = process.env.TwilioAuthToken;
const client = require("twilio")(accountSid, authToken);

async function sendMessage(number, msg) {
  return client.messages
    .create({
      body: msg,
      from: process.env.TwilioPhoneNumber,
      to: number || "+14128411697"
    })
    .then(message => {
      return message;
    })
    .catch(e => {
      return e;
    });
}

router.post("/sms", async function(req, res, next) {
  console.log(util.inspect(req.body));

  const { From, Body } = req.body;

  // record message as entry
  await LogEntry.create({
    phone: From,
    text: Body,
    text_lower: Body.toLowerCase(),
    twilio: req.body
  });


  // existing user?
  let user = await User.findOne({ phone: From });

  // send welcome message to new users
  if (!user) {
    await User.create({ phone: From });

    const twiml = new MessagingResponse();
    twiml.message("Welcome to My Little Life Log!");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
});

module.exports = router;
