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
  }
}

module.exports = {
  smsReply
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
