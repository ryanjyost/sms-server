const { Pool } = require("pg");
const pool = new Pool();

const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  }
});

module.exports = {
  knex,
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};
