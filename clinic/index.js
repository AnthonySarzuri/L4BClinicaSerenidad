const express = require('express');
const path = require('path');
const pacientesRoutes = require('./routes/pacientes');
const terapeutasRoutes = require('./routes/terapeutas');
const historialesRoutes = require('./routes/historiales'); // Rutas de historiales

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/pacientes', pacientesRoutes);
app.use('/terapeutas', terapeutasRoutes);
app.use('/historiales', historialesRoutes); // Añadir rutas de historiales

// Ruta principal
app.get('/', (req, res) => res.render('welcome'));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});