const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false, // Permitir SSL sin verificación de certificado
    },
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de la base de datos:', err);
    process.exit(-1);
});

module.exports = pool;
