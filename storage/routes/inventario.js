const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');


// Ruta para cargar el formulario de edición
router.get('/productos/:id/editar', inventarioController.cargarFormularioEdicion);

// Rutas para Droguerías
router.get('/droguerias', inventarioController.listarDroguerias);
router.post('/droguerias', inventarioController.crearDrogueria);
router.post('/droguerias/:id/eliminar', inventarioController.eliminarDrogueria);

// Rutas para Productos
router.get('/productos', inventarioController.listarProductos);
router.post('/productos', inventarioController.crearProducto);
router.post('/productos/:id/editar', inventarioController.editarProducto); // Guardar edición
router.post('/productos/:id/eliminar', inventarioController.eliminarProducto);

module.exports = router;
