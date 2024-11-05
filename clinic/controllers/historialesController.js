const historialesModel = require('../models/historialesModel');
const terapeutasModel = require('../models/terapeutasModel');

// Mostrar formulario de historial clínico con lista de terapeutas
exports.mostrarFormularioHistorial = async (req, res) => {
    try {
        const { paciente_id } = req.params;
        const terapeutas = await terapeutasModel.getTerapeutas(); // Obtener terapeutas

        res.render('historialClinico', { paciente_id, terapeutas, error: null });
    } catch (error) {
        console.error('Error al mostrar el formulario de historial clínico:', error);
        res.status(500).send('Error del servidor');
    }
};

// Crear historial clínico
exports.crearHistorial = async (req, res) => {
    try {
        const { paciente_id, terapeuta_id, descripcion, observaciones } = req.body;
        await historialesModel.crearHistorial(paciente_id, terapeuta_id, descripcion, observaciones);
        res.redirect('/pacientes'); // Redirige al listado de pacientes
    } catch (error) {
        console.error('Error al crear historial clínico:', error);
        res.render('historialClinico', {
            paciente_id: req.body.paciente_id,
            terapeutas: [], // Enviar una lista vacía si hay un error
            error: 'No se pudo crear el historial.',
        });
    }
};

exports.verHistorial = async (req, res) => {
    try {
        const { paciente_id } = req.params;
        const historial = await historialesModel.getHistorialByPacienteId(paciente_id);

        if (!historial) {
            return res.status(404).send('Historial no encontrado');
        }

        res.render('verHistorial', { historial });
    } catch (error) {
        console.error('Error al obtener el historial clínico:', error);
        res.status(500).send('Error del servidor');
    }
};