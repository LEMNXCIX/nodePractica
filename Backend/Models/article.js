"use strict";

//los modelos sirven como esquema de datos para mongoose en el backend

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  image: String,
});
//Article >> es el nombre del esquema que se va a exportar
//ArticleSchema >> es el modelo detallado arriba
module.exports = mongoose.model('Article', ArticleSchema);
//articles >> guarda docuemntos de este tipo y con esta estructura dentro de la colecionn