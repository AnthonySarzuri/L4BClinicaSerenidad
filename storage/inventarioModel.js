const pool = require('../clinic/db');

// CRUD Droguerías
const getDroguerias = async () => {
    const result = await pool.query('SELECT * FROM Droguerias');
    return result.rows;
};

const createDrogueria = async (nombre) => {
    await pool.query('INSERT INTO Droguerias (nombre) VALUES ($1)', [nombre]);
};

// CRUD Productos
const getProductos = async () => {
    const result = await pool.query(`
        SELECT p.producto_id, p.nombre, p.descripcion, p.precio, p.cantidad, 
               p.fechaCaducidad, p.NroLote, p.FechaLote, d.nombre AS drogueria
        FROM Productos p
        JOIN Droguerias d ON p.drogueria_id = d.drogueria_id
    `);
    return result.rows;
};

const createProducto = async (producto) => {
    const { nombre, descripcion, precio, cantidad, drogueria_id, fechaCaducidad, NroLote, FechaLote } = producto;
    await pool.query(
        `INSERT INTO Productos (nombre, descripcion, precio, cantidad, drogueria_id, fechaCaducidad, NroLote, FechaLote) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [nombre, descripcion, precio, cantidad, drogueria_id, fechaCaducidad, NroLote, FechaLote]
    );
};

module.exports = { getDroguerias, createDrogueria, getProductos, createProducto };
