const pool = require('../db');

// Buscar enfermedades por nombre o descripción
const buscarEnfermedades = async (termino) => {
    const query = `
        SELECT * 
        FROM enfermedades 
        WHERE nombre ILIKE $1 OR descripcion ILIKE $1;
    `;
    const result = await pool.query(query, [`%${termino}%`]);
    return result.rows;
};

module.exports = { buscarEnfermedades };
