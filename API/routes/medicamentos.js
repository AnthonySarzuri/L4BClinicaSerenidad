const express = require('express');
const router=express.Router();
const medicamentosController= require('../controllers/medicamentosController');

//esta es la ruta que obtiene el listado de medicamentos
router.get('/', medicamentosController.listarMedicamentos);

module.exports=router;