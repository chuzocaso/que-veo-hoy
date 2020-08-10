var mysql = require ("mysql");

var configConnection = {
    host: "localhost",
    user: "root",
    password: "1234",
    database: "peliculas",
    port: 3306
}

var connection = mysql.createConnection(configConnection);

module.exports = connection;
