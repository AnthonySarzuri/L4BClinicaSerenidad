const { Pool } = require('pg');
require('dotenv').config(); // Cargar variables de entorno

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: { rejectUnauthorized: false },
    max: 10, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

// Probar la conexión
pool.connect()
    .then(() => console.log('Conexión exitosa a la base de datos de inventarios'))
    .catch((err) => console.error('Error al conectar a la base de datos:', err));

module.exports = pool;
