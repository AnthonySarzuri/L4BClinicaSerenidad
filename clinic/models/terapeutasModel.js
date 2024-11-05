const pool = require('../db');

// Obtener la lista de terapeutas activos
const getTerapeutas = async () => {
    const query = `
        SELECT t.terapeuta_id, t.especialidad, t.licencia_medica, 
               t.fecha_contrato, t.estado, t.fecha_estado, 
               p.nombre, p.apellido, p.telefono, p.email, p.foto, 
               TO_CHAR(p.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento
        FROM terapeutas t
        JOIN personas p ON t.persona_id = p.persona_id
        WHERE t.estado = TRUE
        ORDER BY t.terapeuta_id ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// Verificar email duplicado
const verificarEmail = async (email) => {
    const result = await pool.query('SELECT email FROM personas WHERE email = $1', [email]);
    return result.rows.length > 0;
};

// Verificar licencia médica duplicada
const verificarLicenciaMedica = async (licencia_medica) => {
    const result = await pool.query('SELECT licencia_medica FROM terapeutas WHERE licencia_medica = $1', [licencia_medica]);
    return result.rows.length > 0;
};

// Crear terapeuta
const createTerapeuta = async (personaData, terapeutaData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const personaResult = await client.query(
            'INSERT INTO personas (nombre, apellido, telefono, email, foto, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING persona_id',
            personaData
        );
        const personaId = personaResult.rows[0].persona_id;

        await client.query(
            'INSERT INTO terapeutas (persona_id, especialidad, licencia_medica, fecha_contrato, estado) VALUES ($1, $2, $3, CURRENT_DATE, TRUE)',
            [personaId, terapeutaData.especialidad, terapeutaData.licencia_medica]
        );

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Obtener terapeuta por ID
const getTerapeutaById = async (id) => {
    const result = await pool.query(`
        SELECT t.terapeuta_id, t.especialidad, t.licencia_medica, 
               p.nombre, p.apellido, p.telefono, p.email, p.foto, 
               p.fecha_nacimiento
        FROM terapeutas t
        JOIN personas p ON t.persona_id = p.persona_id
        WHERE t.terapeuta_id = $1
    `, [id]);
    return result.rows[0];
};

// Actualizar terapeuta
const actualizarTerapeuta = async (id, datos) => {
    const { nombre, apellido, telefono, email, especialidad, licencia_medica, fecha_nacimiento, foto } = datos;

    await pool.query(`
        UPDATE personas 
        SET nombre = $1, apellido = $2, telefono = $3, email = $4, fecha_nacimiento = $5, foto = $6
        WHERE persona_id = (SELECT persona_id FROM terapeutas WHERE terapeuta_id = $7)
    `, [nombre, apellido, telefono, email, fecha_nacimiento, foto, id]);

    await pool.query(`
        UPDATE terapeutas 
        SET especialidad = $1, licencia_medica = $2 
        WHERE terapeuta_id = $3
    `, [especialidad, licencia_medica, id]);
};

// Eliminación lógica
const eliminarTerapeutaLogico = async (id) => {
    const query = `
        UPDATE terapeutas 
        SET estado = FALSE, fecha_estado = CURRENT_DATE 
        WHERE terapeuta_id = $1;
    `;
    await pool.query(query, [id]);
};

module.exports = {
    getTerapeutas,
    verificarEmail,
    verificarLicenciaMedica,
    createTerapeuta,
    eliminarTerapeutaLogico,
    getTerapeutaById,
    actualizarTerapeuta,
};