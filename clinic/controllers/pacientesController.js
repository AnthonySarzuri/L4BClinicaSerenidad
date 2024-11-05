const pacientesModel = require('../models/pacientesModel');

exports.createPaciente = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, fecha_nacimiento, genero, direccion, numero_seguro } = req.body;
        const foto = req.file ? req.file.filename : null;

        const emailExistente = await pacientesModel.verificarEmail(email);
        if (emailExistente) {
            return res.render('crearPaciente', {
                nombre, apellido, telefono, email, fecha_nacimiento, genero, direccion, numeroSeguro: numero_seguro,
                error: 'El email ya está registrado. Intente con otro.', foto
            });
        }

        const personaData = [nombre, apellido, fecha_nacimiento, genero, direccion, telefono, email, foto];
        await pacientesModel.createPaciente(personaData, numero_seguro);

        res.redirect('/pacientes?mensaje=Paciente registrado con éxito');
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.render('crearPaciente', {
            nombre, apellido, telefono, email, fecha_nacimiento, genero, direccion, numeroSeguro: numero_seguro,
            error: 'Error en el servidor: No se pudo crear el paciente.', foto
        });
    }
};

exports.listarPacientes = async (req, res) => {
    try {
        const pacientes = await pacientesModel.getPacientes();

        // Verificar si cada paciente tiene un historial
        for (let paciente of pacientes) {
            paciente.tieneHistorial = await pacientesModel.tieneHistorial(paciente.persona_id);
        }

        res.render('pacientes', { pacientes });
    } catch (error) {
        console.error('Error al listar pacientes:', error);
        res.status(500).send('Error en el servidor');
    }
};