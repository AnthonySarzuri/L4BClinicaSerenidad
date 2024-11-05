const express = require('express');
const path = require('path');
const pool = require('./db'); // Importa el pool de conexión
const inventarioRoutes = require('./routes/inventario'); // Importa las rutas del inventario
const ventasRoutes = require('./routes/ventas'); // Importa las rutas de ventas
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/ventas', ventasRoutes);

// Verificar la conexión a la base de datos
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
    } else {
        console.log('Conectado exitosamente a la base de datos:', result.rows[0]);
    }
});

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que las vistas están en la carpeta correcta

// Middleware para manejar formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definición de rutas
app.use('/', inventarioRoutes);
app.use('/ventas', ventasRoutes); // Registro único de rutas de ventas

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de inventario corriendo en el puerto ${PORT}`);
});
