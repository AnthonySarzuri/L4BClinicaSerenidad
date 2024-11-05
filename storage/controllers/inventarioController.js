const inventarioModel = require('../models/inventarioModel');
const pool = require('../db'); // Asegúrate de que la ruta sea correcta

// Listar droguerías
exports.listarDroguerias = async (req, res) => {
    try {
        const droguerias = await inventarioModel.getDroguerias();
        res.render('droguerias', { droguerias });
    } catch (error) {
        console.error('Error al listar droguerías:', error);
        res.status(500).send('Error en el servidor');
    }
};

// Crear droguería
exports.crearDrogueria = async (req, res) => {
    let { nombre } = req.body;

    // Eliminar espacios en blanco al inicio y al final
    nombre = nombre.trim();

    // Validar el nombre (debe contener al menos 3 caracteres después de eliminar los espacios)
    const nombreValido = /^[a-zA-Z\s]{3,}$/.test(nombre) && nombre.length >= 3;
    if (!nombreValido) {
        const errorMsg = 'El nombre de la droguería es inválido. Debe tener al menos 3 caracteres y solo puede contener letras y espacios.';
        const droguerias = await inventarioModel.getDroguerias(); // Obtener las droguerías existentes para mostrar en la vista
        return res.render('droguerias', { droguerias, errorMsg });
    }

    // Lógica de creación si el nombre es válido
    try {
        await inventarioModel.createDrogueria(nombre);
        res.redirect('/droguerias');
    } catch (error) {
        console.error('Error al crear la droguería:', error);
        res.status(500).send('Error en el servidor');
    }
};


// Borrado lógico de droguería
exports.eliminarDrogueria = async (req, res) => {
    try {
        const { id } = req.params;
        await inventarioModel.deleteDrogueria(id);
        res.redirect('/droguerias');
    } catch (error) {
        console.error('Error al eliminar droguería:', error);
        res.status(500).send('Error en el servidor');
    }
};

exports.listarProductos = async (req, res) => {
    try {
        const productos = await inventarioModel.getProductos();
        const droguerias = await inventarioModel.getDroguerias(); // Asegúrate de obtener las droguerías
        res.render('productos', { productos, droguerias, mensajeError: null }); // Pasa 'droguerias' a la vista
    } catch (error) {
        console.error('Error al listar productos:', error);
        res.status(500).send('Error del servidor');
    }
};

// Controlador para crear un producto con validaciones
exports.crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidad, NroLote, fechaCaducidad, drogueria_id } = req.body;

        // Validaciones de los campos
        if (!nombre || nombre.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(nombre)) {
            return res.status(400).send('El nombre del producto es inválido. Debe tener al menos 3 caracteres y solo contener letras y espacios.');
        }
        if (!descripcion || descripcion.trim().length < 3) {
            return res.status(400).send('La descripción es inválida. Debe tener al menos 3 caracteres.');
        }
        if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
            return res.status(400).send('El precio es inválido. Debe ser un número positivo.');
        }
        if (!cantidad || isNaN(cantidad) || parseInt(cantidad) <= 0) {
            return res.status(400).send('La cantidad es inválida. Debe ser un número entero positivo.');
        }
        if (NroLote && NroLote.trim().length < 1) {
            return res.status(400).send('El número de lote es inválido.');
        }

        // Si todas las validaciones pasan, crea el producto
        await inventarioModel.createProducto({ nombre, descripcion, precio, cantidad, NroLote, fechaCaducidad, drogueria_id });
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).send('Error en el servidor');
    }
};

// Cargar formulario de edición
exports.cargarFormularioEdicion = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await inventarioModel.getProductoById(id);
        const droguerias = await inventarioModel.getDroguerias();
        res.render('editarProducto', { producto, droguerias });
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).send('Error en el servidor');
    }
};

// Editar producto
exports.editarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = req.body;
        await inventarioModel.updateProducto(id, producto);
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al editar producto:', error);
        res.status(500).send('Error del servidor');
    }
};

// Borrado lógico de producto
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await inventarioModel.deleteProducto(id);
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error en el servidor');
    }
};

// Obtener ventas entre fechas
exports.obtenerVentasPorFecha = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query; // Parámetros de la solicitud
        const query = `
            SELECT fecha, SUM(total) AS total_ventas
            FROM ventas
            WHERE fecha BETWEEN $1 AND $2
            GROUP BY fecha
            ORDER BY fecha;
        `;
        const result = await pool.query(query, [fechaInicio, fechaFin]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        res.status(500).send('Error del servidor');
    }
};

exports.mostrarDashboardVentas = (req, res) => {
    console.log('Renderizando vista de ventas');
    res.render('ventas');
};



// Controlador para obtener ventas entre fechas
exports.obtenerVentasPorFecha = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const query = `
            SELECT fecha, SUM(total) AS total
            FROM ventas
            WHERE fecha BETWEEN $1 AND $2
            GROUP BY fecha
            ORDER BY fecha;
        `;
        const result = await pool.query(query, [fechaInicio, fechaFin]);
        res.json(result.rows); // Enviar el resultado como JSON
    } catch (error) {
        console.error('Error al obtener datos de ventas:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

