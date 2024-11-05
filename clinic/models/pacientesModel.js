const pool = require('../db');

// Verificar si el email ya existe
const verificarEmail = async (email) => {
    const result = await pool.query('SELECT email FROM personas WHERE email = $1', [email]);
    return result.rows.length > 0;
};

// Crear un paciente y su historial clínico
const createPaciente = async (personaData, numeroSeguro) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const personaResult = await client.query(`
            INSERT INTO personas (nombre, apellido, fecha_nacimiento, genero, direccion, telefono, email, foto) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING persona_id
        `, personaData);
        const personaId = personaResult.rows[0].persona_id;

        const pacienteResult = await client.query(`
            INSERT INTO pacientes (persona_id, numero_seguro) 
            VALUES ($1, $2) RETURNING paciente_id
        `, [personaId, numeroSeguro]);
        const pacienteId = pacienteResult.rows[0].paciente_id;

        await client.query('COMMIT');
        return pacienteId;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Obtener lista de pacientes activos
const getPacientes = async () => {
    const query = `
        SELECT p.persona_id, p.nombre, p.apellido, p.email, p.telefono, 
               pa.numero_seguro, p.foto 
        FROM personas p
        JOIN pacientes pa ON p.persona_id = pa.persona_id
        WHERE pa.estado = TRUE
        ORDER BY p.persona_id ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// Eliminación lógica de paciente
const eliminarPacienteLogico = async (id) => {
    const query = `
        UPDATE pacientes 
        SET estado = FALSE 
        WHERE persona_id = $1;
    `;
    await pool.query(query, [id]);
};

// Obtener paciente por ID
const getPacienteById = async (id) => {
    const result = await pool.query(`
        SELECT p.*, pa.numero_seguro 
        FROM personas p 
        JOIN pacientes pa ON p.persona_id = pa.persona_id 
        WHERE p.persona_id = $1`, [id]);
    return result.rows[0];
};

// Actualizar paciente
const actualizarPaciente = async (id, datos) => {
    const { nombre, apellido, telefono, email, fecha_nacimiento, genero, direccion, numero_seguro, foto } = datos;
    await pool.query(`
        UPDATE personas 
        SET nombre = $1, apellido = $2, telefono = $3, email = $4, fecha_nacimiento = $5, 
            genero = $6, direccion = $7, foto = $8 
        WHERE persona_id = $9`, 
        [nombre, apellido, telefono, email, fecha_nacimiento, genero, direccion, foto, id]);

    await pool.query(`UPDATE pacientes SET numero_seguro = $1 WHERE persona_id = $2`, [numero_seguro, id]);
};

const tieneHistorial = async (paciente_id) => {
    const query = `
        SELECT COUNT(*) FROM historial_clinico WHERE paciente_id = $1;
    `;
    const result = await pool.query(query, [paciente_id]);
    return parseInt(result.rows[0].count) > 0;
};

module.exports = { 
    createPaciente, 
    getPacientes, 
    verificarEmail, 
    getPacienteById, 
    actualizarPaciente, 
    eliminarPacienteLogico,
    tieneHistorial
};
