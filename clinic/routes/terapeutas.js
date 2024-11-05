const express = require('express');
const router = express.Router();
const terapeutasController = require('../controllers/terapeutasController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para subir fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});
const upload = multer({ storage });

// Rutas
router.get('/', terapeutasController.listarTerapeutas);

// Ruta para crear un nuevo terapeuta
router.get('/nuevo', (req, res) => {
    res.render('crearTerapeuta', {
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        especialidad: '',
        licencia_medica: '',
        fecha_nacimiento: '',
        error: null,
        foto: null
    });
});

router.post('/nuevo', upload.single('foto'), terapeutasController.createTerapeuta);

// Ruta para mostrar la vista de edición del terapeuta
router.get('/:id/editar', terapeutasController.mostrarEditarTerapeuta);

// Ruta para manejar la actualización del terapeuta
router.post('/:id/editar', upload.single('foto'), terapeutasController.editarTerapeuta);

// Ruta para eliminar terapeuta (eliminación lógica)
router.post('/:id/eliminar', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`ID recibido en la ruta: ${id}`);
        await terapeutasController.eliminarTerapeuta(req, res);
    } catch (error) {
        console.error('Error en la ruta de eliminación:', error);
        res.status(500).send('Error del servidor.');
    }
});

module.exports = router;