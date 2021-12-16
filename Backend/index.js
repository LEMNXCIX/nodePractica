"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3900;

//configuracion basica de mongoose
mongoose.Promise = global.Promise;
// mongoose.set('useFindAndModify', false);

//URL =  mongodb:// direcion : puerto / nombre de la coleccion
//OPCIONES {useNewUrlParser :true} >> para utilizar las ultimas indicaciones de mongoose
mongoose
  .connect("mongodb://localhost:27017/api_rest", { useNewUrlParser: true })
  .then(() => {
    console.log("La conexion a la base de datos se ha realizado");

    //Crear servidror
    app.listen(port,()=>{
        console.log("Servidor HTTP en http://localhost:"+port);
    })
  });
