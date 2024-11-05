const express = require('express');
const router = express.Router();
const historialesController = require('../controllers/historialesController');

// Ruta para mostrar el formulario de historial clínico
router.get('/nuevo/:paciente_id', historialesController.mostrarFormularioHistorial);

// Ruta para ver el historial clínico de un paciente
router.get('/ver/:paciente_id', historialesController.verHistorial);

// Ruta para procesar el registro del historial clínico
router.post('/', historialesController.crearHistorial);

module.exports = router;
