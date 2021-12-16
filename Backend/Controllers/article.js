//este documento permite controlar los datos de articulos del modelo
"use strict";
var validator = require("validator");
var Article = require("../Models/article");
var fs = require("fs");
var path = require("path");
const { exists } = require("../Models/article");

var controller = {
  datosCurso: (req, res) => {
    var hola = req.body.hola;
    return res.status(200).send({
      curso: "Master en JS",
      autor: "Leonardo Mero",
      url: "www.google.com",
      hola,
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "es la accion llamada test",
    });
  },

  //Este metodo permite validar los datos por post antes de guardarlos en la base de datos
  save: (req, res) => {
    //Recoger datos por post
    var params = req.body;

    //Validar datos >> Validator
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }
    if (validate_title && validate_content) {
      //Crear el objeto a guradat
      var article = new Article();

      //Asignar valores
      //Pasan los datos del params al modelo se usan los mismos elementos que ya hans sido creados
      article.title = params.title;
      article.content = params.content;
      //article.date se asigna automaticamente no es necesario codificarlo
      article.image = null; //>>la asignacion se hace aparte
      //Guardar articulo
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "Los datos no se ha guardado",
          });
        }

        //Devolver respuesta
        return res.status(200).send({
          status: "success",
          article: articleStored,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son validos",
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({});
    var last = req.params.last;

    //si existe el paramentro en la url se muestran los ultimos 5 articulos
    if (last || last != undefined) {
      query.limit(5);
    }

    //find para buscar los articulos de la base de datos
    //find >> se puede especificar el tipo de restriciojes al momento de realizar la busqueda
    //sort >> para ordenar el array del JSON asc mas reciente primero _id o desc mas antiguo primero -_id
    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al devolver datos",
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "No existen articulos",
        });
      }
      return res.status(200).send({
        status: "success",
        articles,
      });
    });
  },

  getArticle: (req, res) => {
    //Recoger id de la url
    var articleId = req.params.id;

    //Comprobar que existe
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el articulo ",
      });
    }
    //Buscar el articulo
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "error",
          message: "No existe el articulo",
        });
      }
      //Devolver el JSON
      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },

  update: (req, res) => {
    //Recoger el id de la url
    var articleId = req.params.id;
    //Recoger los datos por el put
    var params = req.body;
    //Validar datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }
    if (validate_title && validate_content) {
      //Find and update
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdate) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar",
            });
          }
          if (!articleUpdate) {
            return res.status(404).send({
              status: "error",
              message: "No existe el articulo",
            });
          }
          return res.status(200).send({
            status: "success",
            article: articleUpdate,
          });
        }
      );
    } else {
      //Devolver respuesta
      return res.status(200).send({
        status: "error",
        message: "La validadcion es incorecta",
      });
    }
  },

  delete: (req, res) => {
    //Recoger el articulo del id
    var articleId = req.params.id;
    //Find and Delete
    Article.findByIdAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar",
        });
      }
      if (!articleRemoved) {
        return res.status(404).send({
          status: "error",
          message: "No existe eso",
        });
      }
      return res.status(202).send({
        status: "succes",
        article: articleRemoved,
      });
    });
  },

  upload: (req, res) => {
    //Configurar el modulo de connect Multiparty router/article.js

    //Recoger el fichero de la peticion
    var file_name = "Imagen no subida";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }
    //Conseguir el nombre y la extension del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");
    // EN PRODUCION SE DEBE COREGIR LA VARIABLE
    //LINUX O MAC '/'.
    //nombre del archivo
    var file_name = file_split[2];

    //Extension del fichero
    var extension_split = file_name.split(".");
    var file_ext = extension_split[1];
    //Comprobar la extension y validar
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      //borrar el archivo
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "La extension de la imagen no es valida",
        });
      });
    } else {
      //Si todo es valido
      var articleId = req.params.id;
      //Buscar el articulo, asignar el ombre de la imagen y actualizar

      Article.findOneAndUpdate(
        { _id: articleId },
        { image: file_name },
        { new: true },
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(200).send({
              status: "error",
              message:
                "Error al guarfar la imagen del articulo o ya no existe el articulo selecionado",
            });
          }
          return res.status(200).send({
            status: "succes",
            article: articleUpdated,
          });
        }
      );
    }
  },
  getImage: (req, res) => {
    var file = req.params.image;
    var path_file = "./upload/articles/" + file;
    fs.exists(path_file, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(path_file));
      } else {
        return res.status(404).send({
          status: "error",
          message: "La imagen no existe",
        });
      }
    });
  },
  search: (req, res) => {
    //Sacar el string a buscar
    var searchString = req.params.search;

    //Find Or
    Article.find({
      $or: [
        {
          title: { $regex: searchString, $options: "i" },
        },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, articles) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error en la peicion",
          });
        }
        if (!articles || articles.length <= 0) {
          return res.status(404).send({
            status: "error",
            message: "No existen articulos para mostrar",
          });
        }

        return res.status(200).send({
          status: "succes",
          articles,
        });
      });
  },
};
module.exports = controller;
