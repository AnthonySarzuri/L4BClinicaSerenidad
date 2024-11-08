const bcrypt = require("bcrypt"); // Asegúrate de requerir bcrypt en este archivo
const db = require("../db"); // Configuración de la base de datos

const User = {
  findByEmail: async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },
  findById: async (id) => {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    return result.rows[0];
  },
  create: async (username, email, hashedPassword, role) => {
    return await db.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
      [username, email, hashedPassword, role]
    );
  },
};

module.exports = User;
