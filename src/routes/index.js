// Definir todas las rutas principales de la App

// Requerimos express para crear las rutas 
const express = require('express');
const router  = express.Router(); // Metodo router para devolver rutas

// Ruta Inicial
router.get('/', (req,res) =>{
    res.render('index');
});

// Exportar rutas
module.exports = router;