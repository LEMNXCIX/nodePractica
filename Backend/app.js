"use strict";

//Cargar modulos de node para crear el servidor
var express = require("express");
var bodyParser = require("body-parser");

//Ejecutar express HTTP
var app = express();
//Cargar ficheros rutas
var article_routers = require('./Routes/article');

//Middleware
    //Obsoleto
    // app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Anadir prefijos a las rutas >> Cargar rutas
//direcion /api /rutas dentro de article_routes
app.use('/api', article_routers);

//Ruta de prueba
//req = request = peticion  // res = response = respueta
 app.post("/prueba", (req, res) => {
     var hola = req.body.hola;

   console.log(hola);
   //res.estatus = http codes
   return res.status(200).send({
       curso: 'backend',
       nombre: "Leonardo Mero",
       hola
   });
 });

//Exportar el modulo
module.exports = app;
