const db = require("../db");
const { v4: uuid } = require("uuid");

async function list(req, res) {
  const { query } = req;
  const { phone } = query;

  const user = await db
    .knex("users")
    .select("*")
    .where(query)
    .first();

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const logs = await db
    .knex("logs")
    .select("*")
    .where({ user_id: user.id })
    .orderBy("created", "desc");

  res.status(200).json(logs);
}

async function create(req, res) {
  const { body } = req;
  const { user: userId, text } = body;

  if (!text) {
    return res.status(400).json({ error: "Text required." });
  }

  let user = await db
    .knex("users")
    .select("*")
    .where({ id: userId });

  user = user[0];

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const log = await db
    .knex("logs")
    .returning(["id", "user_id", "text", "created"])
    .insert({ id: uuid(), text, user_id: user.id });

  return res.status(200).json(log[0]);
}

module.exports = {
  list,
  create
};
