// Contiene las palabras clave

// Configuracion de la base de datos
// Exporta los objetos con la configuracion de la DB
console.log("Importando config DB en keys.js");

module.exports = {
    //Objeto de configuracion de mi base de datos
    database: {
        host: process.env.DB_HOST, // Donde esta alojada localhost
        user: process.env.DB_USER, // Datos de conexion root
        password: process.env.DB_PASS, //Sharingan321
        database: process.env.DB_DATABASE // database_ links
    }
};