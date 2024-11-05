const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }
});

pool.connect((error, client, release) => {
  if (error) {
    return console.error("Error en la conexión a la base de datos.", error.stack);
  }
  client.query("SELECT NOW()", (error, result) => {
    release();
    if (error) {
      return console.error("Error al ejecutar el query.", error.stack);
    }
    console.log("Conectado exitosamente a la base de datos.");
  });
});

module.exports = pool;