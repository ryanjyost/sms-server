const db = require("../db");
const { v4: uuid } = require("uuid");

const accountSid = process.env.TwilioAccountSid;
const authToken = process.env.TwilioAuthToken;
const client = require("twilio")(accountSid, authToken);

async function smsReply(req, res) {
  try {
    const { From, Body } = req.body;

    console.log({ From, Body });

    let user = await db
      .knex("users")
      .select("*")
      .where({ phone: From })
      .first();

    if (!user) {
      await sendMessage(
        `Hey 👋. Head over to [MyPrivateLifelog dot com] to start your own lifelog. Once set up, you'll be able to add entries by texting this number.`,
        From
      );

      return res.status(200);
    }

    let log = await db
      .knex("logs")
      .returning(["id", "user_id", "text", "created"])
      .insert({ id: uuid(), text: Body, user_id: user.id });

    log = log[0];

    console.log(`Saved log: ${log.id} at ${log.created}`);

    res.status(200);
  } catch (e) {
    console.log({ e });
    res.status(200);
  }
}

async function verify(req, res) {
  client.verify
    .services(process.env.TwilioVerifySid)
    .verifications.create({ to: req.body.phone, channel: "sms" })
    .then(verification => {
      console.log({ verification });
      res.json({ status: verification.status });
    })
    .catch(e => res.json({ status: "error" }));
}

async function confirm(req, res) {
  client.verify
    .services(process.env.TwilioVerifySid)
    .verificationChecks.create({ to: req.body.phone, code: req.body.code })
    .then(async verificationCheck => {
      console.log({ verificationCheck });
      await db
        .knex("users")
        .where({ id: req.body.user })
        .update({ phone: verificationCheck.to });
      res.json({ status: verificationCheck.status });
    })
    .catch(e => res.status(500).json({ status: "error", e }));
}

module.exports = {
  smsReply,
  verify,
  confirm
};

async function sendMessage(msg, number) {
  return client.messages
    .create({
      body: msg,
      from: process.env.TwilioPhoneNumber,
      to: number
    })
    .then(message => {
      console.log({ message });
      return message;
    })
    .catch(e => {
      console.log({ e });
      return e;
    });
}
