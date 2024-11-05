const express = require('express');
const medicamentosRoutes=require('./routes/medicamentos');

const app=express();
const PORT = process.env.PORT || 5000;

//middleware de JSON
app.use(express.json());

//rutas
app.use('/API/medicamentos',medicamentosRoutes);

//iniciamos el servidor aca
app.listen(PORT,()=>{
    console.log(`API corriendo en el puerto ${PORT}`);
});