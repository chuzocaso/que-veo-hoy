//se importa una referencia a la conexión.
var con = require('../lib/conexionbd');

function obtenerPeliculas(req, res) {
    //se obtienen los query param
    var titulo = req.query.titulo;
    var anio = req.query.anio;
    var genero = req.query.genero;
    var columna_orden = req.query.columna_orden;
    var tipo_orden = req.query.tipo_orden;
    var cantidad = req.query.cantidad;
    var pagina = req.query.pagina;
    //Se realizan validaciones para conformar la consulta según los parametros que se envíen
    if (titulo) {
        var sql = "select * from pelicula where titulo like '%" + titulo + "%'";
        if (anio) {
            sql = sql + " and anio = " + anio;
        }    
        if (genero) {
            sql = sql + " and genero_id = " + genero;
        }
        
    } else if (anio) {
        var sql = "select * from pelicula where anio = " + anio;
        if (genero) {
            sql = sql + " and genero_id = " + genero;
        }
    } else if (genero) {
        var sql = "select * from pelicula where genero_id = " + genero;
    } else {
        //si no fue enviado ningún parametro, se asigna la consulta que obtiene todas las peliculas
        var sql = "select * from pelicula";
    }

    //obtengo la totalidad de los resultados y guardo la cantidad obtenida en la variable cantidadDeResultados
    var cantidadDeResultados = 0;
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        cantidadDeResultados = resultado.length;
    });

    //ordeno la consulta realizada y limito resultados con los parámetros de página y cantidad a mostrar
    var primeraFila = pagina*cantidad-cantidad;
    sql = sql + " order by " + columna_orden + " " + tipo_orden + " limit " + primeraFila + ", " + cantidad;

    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no hubo error, se crea el objeto respuesta con las peliculas encontradas y la cantidad de resultados totales
        var respuesta = {
            'peliculas': resultado,
            'total': cantidadDeResultados,
        };
        //se envía la respuesta
        res.send(JSON.stringify(respuesta));
    });
}

function obtenerGeneros(req, res) {
    //se obtienen todos los generos
    var sql = "select * from genero";
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no hubo error, se crea el objeto respuesta con los generos encontrados
        var respuesta = {
            'generos': resultado
        };
        //se envía la respuesta
        res.send(JSON.stringify(respuesta));
    });
}

function buscarPelicula(req, res) {
    //se obtiene el path param id
    var id = req.params.id;
    //se crea la consulta que obtiene el id
    var sqlActores = "select nombre from actor JOIN actor_pelicula ON actor.id=actor_id where pelicula_id = " + id;
    var actores;
    con.query(sqlActores, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no se encontró ningún resultado, se envía un mensaje con el error
        if (resultado.length == 0) {
            console.log("No se encontro ninguna canción con ese id");
            return res.status(404).send("No se encontro ninguna canción con ese id");
        } else {
            //se guardan los actores encontrados en la variable actores
            actores = resultado;
        }

    });

    //realizo la consulta para obtener los datos de la película con el id pasado por parámetro
    var sql = "select titulo,duracion,director,anio,fecha_lanzamiento,puntuacion,poster,trama,nombre from pelicula JOIN genero ON pelicula.genero_id=genero.id where pelicula.id = " + id;
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no se encontró ningún resultado, se envía un mensaje con el error
        if (resultado.length == 0) {
            console.log("No se encontro ninguna película con ese id");
            return res.status(404).send("No se encontro ninguna película con ese id");
        } else {
            var respuesta = {
                //se crea el objeto respuesta con los datos de pelicula encontrada y los actores
                'pelicula': resultado[0],
                'actores': actores
            };
            //se envía la respuesta
            res.send(JSON.stringify(respuesta));
        }
    });
}

function recomendarPelicula(req, res) {
    //se obtienen los query param
    var anio_inicio = req.query.anio_inicio;
    var anio_fin = req.query.anio_fin;
    var genero = req.query.genero;
    var puntuacion = req.query.puntuacion;
    //Se realizan validaciones para conformar la consulta según los parametros que se envíen
    if (genero) {
        var sql = "select pelicula.id,titulo,genero.nombre,poster,trama from pelicula JOIN genero on pelicula.genero_id=genero.id where genero.nombre = '" + genero + "'";
        if (puntuacion) {
            sql = sql +  " and puntuacion >= " + puntuacion;
        } else if (anio_fin & anio_inicio){
            sql = sql + " and anio BETWEEN " + anio_inicio + " and " + anio_fin;
        }
    } else if (puntuacion) {
        var sql = "select pelicula.id,titulo,genero.nombre,poster,trama from pelicula JOIN genero on pelicula.genero_id=genero.id where puntuacion >= " + puntuacion;

    } else if (anio_fin & anio_inicio){
        //si no fue enviado ningún parametro, se asigna la consulta que obtiene todas las peliculas
        var sql = "select pelicula.id,titulo,genero.nombre,poster,trama from pelicula JOIN genero on pelicula.genero_id=genero.id where anio BETWEEN " + anio_inicio + " and " + anio_fin;
    } else{
        var sql = "select pelicula.id,titulo,genero.nombre,poster,trama from pelicula JOIN genero on pelicula.genero_id=genero.id";
    }

   //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no hubo error, se crea el objeto respuesta con las peliculas encontradas
        var respuesta = {
            'peliculas': resultado,
        };
        //se envía la respuesta
        res.send(JSON.stringify(respuesta));
    });
}

//se exportan las funciones creadas
module.exports = {
    obtenerPeliculas: obtenerPeliculas,
    obtenerGeneros: obtenerGeneros,
    buscarPelicula: buscarPelicula,
    recomendarPelicula: recomendarPelicula
};