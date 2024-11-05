const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');
const pacientesModel = require('../models/pacientesModel');
const historialesController = require('../controllers/historialesController'); // Importación añadida
const multer = require('multer');
const path = require('path');
const pool = require('../db'); // Asegúrate de que este módulo esté disponible

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter(req, file, cb) {
        const allowedExtensions = /jpg|jpeg|png|gif/;
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype;

        if (allowedExtensions.test(ext) && mimeType.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen.'));
        }
    }
});

// Rutas de pacientes
router.get('/', pacientesController.listarPacientes);

router.get('/nuevo', (req, res) => {
    res.render('crearPaciente', { 
        nombre: '', apellido: '', telefono: '', email: '', 
        fecha_nacimiento: '', genero: '', direccion: '', numeroSeguro: '', 
        error: null, foto: null 
    });
});

router.get('/foto/:personaId', async (req, res) => {
    try {
        const { personaId } = req.params;
        const result = await pool.query('SELECT foto FROM personas WHERE persona_id = $1', [personaId]);

        if (result.rows.length > 0 && result.rows[0].foto) {
            const foto = result.rows[0].foto;
            res.set('Content-Type', 'image/png');
            res.end(foto); // Enviar la imagen como buffer
        } else {
            res.status(404).send('Foto no encontrada');
        }
    } catch (error) {
        console.error('Error al obtener la foto:', error);
        res.status(500).send('Error del servidor');
    }
});

router.post('/', upload.single('foto'), pacientesController.createPaciente);

router.get('/:id/editar', async (req, res) => {
    try {
        const paciente = await pacientesModel.getPacienteById(req.params.id);
        res.render('editarPaciente', { paciente, error: null });
    } catch (error) {
        console.error('Error al cargar el paciente:', error);
        res.status(500).send('Error del servidor.');
    }
});

router.post('/:id/editar', upload.single('foto'), async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, fecha_nacimiento, genero, direccion, numero_seguro } = req.body;
        const foto = req.file ? req.file.filename : req.body.fotoExistente;

        await pacientesModel.actualizarPaciente(req.params.id, {
            nombre, apellido, telefono, email, fecha_nacimiento, genero, direccion, numero_seguro, foto
        });

        res.redirect('/pacientes?mensaje=Paciente actualizado con éxito');
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.render('editarPaciente', { paciente: req.body, error: 'No se pudo actualizar el paciente.' });
    }
});

router.post('/:id/eliminar', async (req, res) => {
    try {
        await pacientesModel.eliminarPacienteLogico(req.params.id);
        res.status(200).send('Paciente eliminado.');
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        res.status(500).send('Error del servidor.');
    }
});

// Ruta para ver el historial clínico del paciente
router.get('/ver/:paciente_id', historialesController.verHistorial);

module.exports = router;