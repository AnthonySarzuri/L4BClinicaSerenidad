const medicamentosModel = require('../models/medicamentosModel');

//este es el controlador para obtener los medicamentos
exports.listarMedicamentos = async (req, res) => {
    try {
        const medicamentos = await medicamentosModel.getMedicamentos();
        res.status(200).json(medicamentos); // Devuelve los medicamentos en formato JSON
    } catch (error) {
        console.error('Error al listar medicamentos:', error);
        res.status(500).json({ error: 'Error al obtener los medicamentos.' });
    }
};