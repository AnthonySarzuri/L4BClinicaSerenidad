const pool = require('../db');

// Crear historial clínico
const crearHistorial = async (paciente_id, terapeuta_id, descripcion, observaciones) => {
    const query = `
        INSERT INTO historial_clinico (paciente_id, terapeuta_id, descripcion, observaciones, fecha_creacion)
        VALUES ($1, $2, $3, $4, CURRENT_DATE);
    `;
    await pool.query(query, [paciente_id, terapeuta_id, descripcion, observaciones]);
};

const obtenerHistorial = async (paciente_id) => {
    const query = `
        SELECT * FROM historial_clinico WHERE paciente_id = $1;
    `;
    const result = await pool.query(query, [paciente_id]);
    return result.rows;
};

const getHistorialByPacienteId = async (paciente_id) => {
    const query = `
        SELECT h.*, 
               p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, 
               tp.nombre AS terapeuta_nombre, tp.apellido AS terapeuta_apellido
        FROM historial_clinico h
        LEFT JOIN pacientes pc ON h.paciente_id = pc.paciente_id
        LEFT JOIN personas p ON pc.persona_id = p.persona_id
        LEFT JOIN terapeutas t ON h.terapeuta_id = t.terapeuta_id
        LEFT JOIN personas tp ON t.persona_id = tp.persona_id
        WHERE h.paciente_id = $1;
    `;
    const result = await pool.query(query, [paciente_id]);
    return result.rows[0];
};

module.exports = { crearHistorial , obtenerHistorial , getHistorialByPacienteId  };
