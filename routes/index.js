const express = require("express");
const router = express.Router();
const db = require("../db");
const { v4: uuid } = require("uuid");

/* GET home page. */

const accountSid = process.env.TwilioAccountSid;
const authToken = process.env.TwilioAuthToken;
const client = require("twilio")(accountSid, authToken);

async function sendMessage(msg, number) {
  return client.messages
    .create({
      body: msg,
      from: process.env.TwilioPhoneNumber,
      to: number
    })
    .then(message => {
      return message;
    })
    .catch(e => {
      console.log({ e });
      return e;
    });
}

router.get("/", function(req, res) {
  res.json({ status: "OK" });
});

router.post("/verify", function(req, res) {
  client.verify
    .services(process.env.TwilioVerifySid)
    .verifications.create({ to: req.body.phone, channel: "sms" })
    .then(verification => {
      res.json({ status: "OK" });
    })
    .catch(e => res.json({ status: "error" }));
});

router.post("/sms/reply", async function(req, res) {
  try {
    const { From, Body } = req.body;

    console.log({ From, Body });

    let phone = await db
      .knex("phone")
      .select("*")
      .where({ phone_number: From });

    if (!phone.length) {
      phone = await db
        .knex("phone")
        .returning(["id", "phone_number"])
        .insert({ id: uuid(), phone_number: From });

      phone = phone[0];

      console.log(`Adding new phone number: ${phone && phone.phone_number}`);

      await sendMessage("Welcome to My Private Lifelog", From);

      return res.status(200);
    } else {
      phone = phone[0];
    }

    let log = await db
      .knex("logs")
      .returning(["id", "phone_id", "text", "created"])
      .insert({ id: uuid(), text: Body, phone_id: phone.id });

    log = log[0];

    console.log(`Saved log: ${log.id} at ${log.created}`);

    res.status(200);
  } catch (e) {
    console.log({ e });
  }
});

module.exports = router;
