const pool = require('../db');

// CRUD Droguerías
const getDroguerias = async () => {
    const result = await pool.query('SELECT * FROM Droguerias WHERE estado = $1', ['activo']);
    return result.rows;
};

const createDrogueria = async (nombre) => {
    await pool.query('INSERT INTO Droguerias (nombre, estado) VALUES ($1, $2)', [nombre, 'activo']);
};

// Función para obtener los productos desde la base de datos
const getProductos = async () => {
    const query = `
        SELECT p.producto_id, p.nombre, p.descripcion, p.precio, 
               p.cantidad, p.nrolote, p.fechacaducidad, 
               d.nombre AS drogueria
        FROM productos p
        LEFT JOIN droguerias d ON p.drogueria_id = d.drogueria_id;
    `;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    getProductos, // Exportar correctamente
    // Otros métodos que estés utilizando
};


// Crear un producto
const createProducto = async (producto) => {
    const { nombre, descripcion, precio, cantidad, fechaCaducidad, NroLote, FechaLote, drogueria_id, tipo_id } = producto;

    // Validación básica
    if (!nombre || nombre.trim().length < 3) {
        throw new Error('El nombre del producto es inválido. Debe tener al menos 3 caracteres.');
    }
    if (precio <= 0) {
        throw new Error('El precio debe ser un número positivo.');
    }
    if (cantidad <= 0) {
        throw new Error('La cantidad debe ser un número positivo.');
    }
    
    // Validación para la fechaCaducidad
    const fechaValida = fechaCaducidad && fechaCaducidad.trim() !== '' ? fechaCaducidad : null;
    if (fechaValida === null) {
        throw new Error('La fecha de caducidad es requerida y no debe estar vacía.');
    }

    const query = `
        INSERT INTO Productos (nombre, descripcion, precio, cantidad, fechaCaducidad, NroLote, FechaLote, drogueria_id, tipo_id, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    await pool.query(query, [nombre, descripcion, precio, cantidad, fechaValida, NroLote, FechaLote, drogueria_id, tipo_id, 'activo']);
};



const updateProducto = async (id, producto) => {
    const { nombre, descripcion, precio, cantidad, fechaCaducidad, nrolote, fechaLote, drogueria_id } = producto;

    const query = `
        UPDATE Productos 
        SET nombre = $1, descripcion = $2, precio = $3, cantidad = $4, 
            fechaCaducidad = $5, nrolote = $6, fechaLote = $7, drogueria_id = $8
        WHERE producto_id = $9
    `;
    await pool.query(query, [nombre, descripcion, precio, cantidad, fechaCaducidad, nrolote, fechaLote, drogueria_id, id]);
};




// Borrado lógico de un producto
const deleteProducto = async (id) => {
    await pool.query('UPDATE Productos SET estado = $1 WHERE producto_id = $2', ['inactivo', id]);
};

// Borrado lógico de una droguería
const deleteDrogueria = async (id) => {
    await pool.query('UPDATE Droguerias SET estado = $1 WHERE drogueria_id = $2', ['inactivo', id]);
};


const getProductoById = async (id) => {
    const query = `
        SELECT producto_id, nombre, descripcion, precio, cantidad, fechaCaducidad, 
               NroLote, FechaLote, drogueria_id, tipo_id
        FROM Productos
        WHERE producto_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};  


module.exports = {
    getDroguerias,
    createDrogueria,
    getProductos,
    createProducto,
    updateProducto,
    deleteProducto,
    deleteDrogueria,
    getProductoById, // Asegúrate de exportar la función aquí
};

