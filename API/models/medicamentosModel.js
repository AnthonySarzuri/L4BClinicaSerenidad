const pool = require('../dbInventarios');

// Esto obtiene la lista de medicamentos disponibles
const getMedicamentos = async () => {
    try {
        const result = await pool.query('SELECT * FROM productos WHERE cantidad > 0');
        return result.rows; // Aquí se usa 'result', no 'results'
    } catch (error) {
        console.error('Error al obtener los medicamentos:', error);
        throw error; // Lanza el error para manejarlo en el controlador
    }
};

module.exports = { getMedicamentos };
