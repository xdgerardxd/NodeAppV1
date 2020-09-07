// Contiene la conexion a la base de datos
console.log("Importando módulo MySQL de database.js");
// Exportar el objeto mysql
const mysql = require('mysql');

// Modulo de Node para convertir codigo de callbacks a codigo de promesas
const { promisify } = require('util'); // solo requiero el metodo promisify del objeto util

// Exporto la configuracion desde keys.js
const { database } = require('./keys.js');

//console.log("usuario imprimiendo antes de crear pool: ", database.user);

// Creo conexion con metodo mysql.createPool (Este modulo usa callback, metodo createPool no soporte las promesas tampoco async and wait)
console.log("Creando pool hacia DB")
const pool = mysql.createPool(database); // Almaceno en variable
console.log("Pool creado");
//console.log("usuario: ", database.user);
//console.log("host: ", database.host);
//console.log("password: ", database.password);
//console.log("database: ", database.database);

// Utilizar o establecer conexion
// Metodo o funcion para llamarlo desde la App
pool.getConnection( (err, connection) =>{ // Recibe un error y la conexion.
    console.log("Estableciendo conexion con DB");
    if (err) { // Si hay eerror, consulto y ejecuto determinada tarea segun el error
        console.log("genero algun error");
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('La conexion con la base de datos ha sido cerrada');
        }

        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La conexion con la base de datos tiene demasiadas conexiones');
        }

        if (err.code === 'ECONNREFUSED'){
            console.error('La conexion con la base de datos ha sido rechazada');
        }

        if (err.code === 'ER_ACCESS_DENIED_ERROR'){
            console.error('Acceso denegado'); 
        }
    }
    //console.log(err);

    if (connection){ // Si hay conexion es decir si es true connection
        connection.release(); // Establezco la conexion
        console.log('Conectado a la Base de datos');
    }
    return;
});

// Exportar conexion de DB

// Promosify pool querys
// la almaceno luego de convertirla a promesa
pool.query = promisify(pool.query); // Cada vez que quiera hacer una consulta podre utilizar async await o promesas

//pool.query = utils.promisify(pool.query).bind(pool);

module.exports = pool; // Exporto conexion