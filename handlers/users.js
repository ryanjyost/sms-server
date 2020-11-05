const db = require("../db");
const { v4: uuid } = require("uuid");

async function create(req, res) {
  const { body } = req;

  const existingUser = await db
    .knex("users")
    .select("*")
    .where({ firebase_id: body.id })
    .first();

  if (existingUser) {
    return res.status(200).json(existingUser);
  }

  const user = await db
    .knex("users")
    .returning(["id", "firebase_id", "phone", "email", "created", "updated"])
    .insert({ id: uuid(), firebase_id: body.id, email: body.email });

  return res.status(201).json({ user: user[0] });
}

async function fetch(req, res) {
  const { query } = req;

  const user = await db
    .knex("users")
    .select("*")
    .where(query)
    .first();

  res.status(200).json({ user });
}

module.exports = {
  create,
  fetch
};
