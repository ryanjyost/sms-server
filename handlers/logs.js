const db = require("../db");
const { v4: uuid } = require("uuid");

async function list(req, res) {
  const { query } = req;
  const { phone } = query;

  const phoneRecord = await db
    .knex("phone")
    .select("*")
    .where({ phone_number: phone })
    .first();

  const logs = await db
    .knex("logs")
    .select("*")
    .where({ phone_id: phoneRecord.id })
    .orderBy("created", "desc");

  res.status(200).json(logs);
}

async function create(req, res) {
  const { body } = req;
  const { phone, text } = body;

  if (!phone || !text) {
    return res.status(400).json({ error: "Phone and text required." });
  }

  const phoneRecord = await db
    .knex("phone")
    .select("*")
    .where({ phone_number: phone })
    .first();

  const log = await db
    .knex("logs")
    .returning(["id", "phone_id", "text", "created"])
    .insert({ id: uuid(), text, phone_id: phoneRecord.id });

  return res.status(200).json(log[0]);
}

module.exports = {
  list,
  create
};
