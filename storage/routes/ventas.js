const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// Ruta para mostrar la vista de ventas
router.get('/', inventarioController.mostrarDashboardVentas);

// Ruta para obtener las ventas entre fechas
router.get('/', inventarioController.obtenerVentasPorFecha);

module.exports = router;
