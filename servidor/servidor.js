//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var peliculasControlador = require('./controladores/peliculasControlador');


var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//cuando se llama a la ruta /peliculas/recomendacion, se ejecuta la acción recomendarPelicula.
app.get('/peliculas/recomendacion', peliculasControlador.recomendarPelicula);
//cuando se llama a la ruta /peliculas, se ejecuta la acción obtenerPeliculas.
app.get('/peliculas', peliculasControlador.obtenerPeliculas);
//cuando se llama a la ruta /generos, se ejecuta la acción obtenerGeneros.
app.get('/generos', peliculasControlador.obtenerGeneros);
//cuando se llama a la ruta /peliculas/:id, se ejecuta la acción buscarPelicula.
app.get('/peliculas/:id', peliculasControlador.buscarPelicula);



//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});


// var mysql = require ("mysql");

// var configConnection = {
//     host: "localhost",
//     user: "root",
//     password: "1234",
//     database: "mibasededatos",
//     port: 3306
// }
// var Usuario = require("./usuarios.js")

// var connection = mysql.createConnection(configConnection);

// connection.connect(function (error) {
//     if (error) {
//         console.log("ERROR: " + error)
//     } else {
//         console.log("Conexion correcta.")
//     }
// });

// // var usuario = new Usuario();
// // console.log(
// //         usuario.nombre("Rodrigo")
// // )

// var result = connection.query("select * from usuario where apellido = 'caso';", function (error, result) {
//     if (error) {
//         console.log("ERROR: " + error)
//     } else {
//         for (let i = 0; i < result.length; i++) {
//             var usuario = result[i];
//             console.log("usuario: " + usuario.id_usuario +
//             " nombre: " + usuario.nombre + " " + usuario.apellido)
//         }
//     }})

// connection.end(function (error) {
//     if (error) {
//         console.log("ERROR: " + error)
//     } else {
//         console.log("Conexion cerrada correctamente.")
//     }
// });

// USUARIOS
// select * from usuarios(...)
// usuario
//     .edad(">10")
//     .nombre("%a%")
//     .build()
// select * from usuarios where true and edad > 10
// class Usuario{
//   constructor() {
//       this.query = "select * from usuarios";
//       this.customquery = "";
//       this.edad = this.edad.bind(this);
//       this.nombre = this.nombre.bind(this);
//       this.build = this.build.bind(this);
//   }
//   edad(filtro){
//       this.query += "and edad" + filtro;
//       return this;
//   }
//   nombre(filtro) {
//       this.query += " and nombre like '" + filtro + "'";
//       return this;
//   }
//   build() {
//       return this.query;
//   }
// };

// module.exports = Usuario;