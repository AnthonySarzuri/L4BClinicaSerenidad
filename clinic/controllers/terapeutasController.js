const terapeutasModel = require('../models/terapeutasModel');

// Listar terapeutas
exports.listarTerapeutas = async (req, res) => {
    try {
        const terapeutas = await terapeutasModel.getTerapeutas();
        res.render('terapeutas', { terapeutas });
    } catch (error) {
        console.error('Error al listar terapeutas:', error);
        res.status(500).send('Error del servidor.');
    }
};

// Crear terapeuta
exports.createTerapeuta = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, especialidad, licencia_medica, fecha_nacimiento } = req.body;
        const foto = req.file ? req.file.filename : null;
        const personaData = [nombre, apellido, telefono, email, foto, fecha_nacimiento];
        const terapeutaData = { especialidad, licencia_medica };

        await terapeutasModel.createTerapeuta(personaData, terapeutaData);
        res.redirect('/terapeutas');
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'personas_email_key') {
            return res.render('crearTerapeuta', {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                telefono: req.body.telefono,
                email: req.body.email,
                especialidad: req.body.especialidad,
                licencia_medica: req.body.licencia_medica,
                fecha_nacimiento: req.body.fecha_nacimiento,
                foto: null,
                error: 'El email ya existe. Por favor, usa uno diferente.'
            });
        }
        console.error('Error al crear terapeuta:', error);
        res.render('errorTerapeuta', { mensaje: 'No se pudo crear el terapeuta.' });
    }
};

// Mostrar formulario de edición de terapeuta
exports.mostrarEditarTerapeuta = async (req, res) => {
    try {
        const terapeuta = await terapeutasModel.getTerapeutaById(req.params.id);
        res.render('editarTerapeuta', { terapeuta, error: null });
    } catch (error) {
        console.error('Error al cargar terapeuta:', error);
        res.status(500).send('Error del servidor.');
    }
};

// Actualizar terapeuta
exports.editarTerapeuta = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, especialidad, licencia_medica, fecha_nacimiento } = req.body;
        const foto = req.file ? req.file.filename : req.body.fotoExistente;

        await terapeutasModel.actualizarTerapeuta(req.params.id, {
            nombre, apellido, telefono, email, especialidad, licencia_medica, fecha_nacimiento, foto
        });

        res.redirect('/terapeutas');
    } catch (error) {
        console.error('Error al editar terapeuta:', error);
        res.render('editarTerapeuta', { terapeuta: req.body, error: 'No se pudo actualizar el terapeuta.' });
    }
};

// Eliminación lógica de terapeuta
exports.eliminarTerapeuta = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Eliminando terapeuta con ID: ${id}`);
        await terapeutasModel.eliminarTerapeutaLogico(id);
        res.status(200).send('Terapeuta eliminado.');
    } catch (error) {
        console.error('Error al eliminar terapeuta:', error);
        res.status(500).send('Error del servidor.');
    }
};