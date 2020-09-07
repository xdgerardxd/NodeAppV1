/* --- Inicializacion de Express y modulos --- */
console.log("Importando modulos iniciales");
const express = require('express');
const morgan  = require('morgan');
const exphbs = require('express-handlebars'); 
const path = require('path');
const flash = require('connect-flash'); // Modulo para enviar mensajes entre vistas

//sesion almacena los datos en la memoria del servidor, puede ser en DB etc por defecto memoria del server
const session = require('express-session'); // llamo al modulo sessiones para el uso de variables globales
const MySQLStore = require('express-mysql-session'); // importo el modulo mysqlsesion para darsela a la propiedad store de sessiones

//Importo la configuracion de la DB
console.log("Importando configuracion de DB - keys.js");
const {database} = require('./keys.js');

//Importo modulo passport
const passport = require('passport'); // Importo para definir eso lo hago en el otro archivo, sino para ejecutar su codigo principal
console.log("Importando módulo passport");
require('./lib/passport.js'); // ya tengo el modulo

// Luego de importar passport va hacia database.js
/* --- Inicializaciones --- */
console.log("Inicializando server");
const app = express(); //mi aplicacion o server

/* --- Settings --- */
/* Server   */   app.set('port', process.env.PORT || 4000);      // Si existe un puerto en el S.O, defino un puerto, si existe un puerto en el sistema tomalo, en caso contrato toma el 4000
/* direccion*/   app.set('views', path.join(__dirname,'views')); // Vistas

/* Engine configuration */                                       // direccion por defecto, direccion de las vistas, direccion de los archivos publicos y tipo de extension y como requiere funcioens de la carpeta lib hay que crear una carpeta en lib llamada handlerbars.js y helpers para ejecutar funciones fuera de handlerbars
console.log("Configurando Engine");
app.engine('.hbs', exphbs({
    defaultLayout: 'main.hbs', 
    layoutsDir:  path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlerbars.js')
}));

/*Usar engine*/ 
app.set('view engine', '.hbs'); // indico que voy a utilizar el motor hbs

/* --- Middleware --- */                       //funciones ejecutadas cada vez que una aplicacion cliente o usuario envia una peticion al servidor
console.log("Inicializacion de Middlewares y variables globales");
app.use(session({ // llamo a la funcion. Uso de la session que acabamos de declarar, la configuro como un objeto
    secret: 'appweblinksssesion', // comoo guardara la session o el nombre
    resave: false,  // No se renove la session
    saveUninitialized: false, // no se vuelva a establecer la sesion
    // la quiero guardar dentro de la DB. Requiero el modulo: express-mysql-session
    store: new MySQLStore(database) // Creo la sesion conectandola a la DB. Requiere la configuracion de la DB que ya tenemos en keys.js
    // Las sesiones con este codigo empezaran a almacenarse en la DB
}));

app.use(flash());  // Uso del modulo flash
app.use(morgan('dev'));                        // string dev para mostrar un determinado tipo de mensaje por consola
app.use(express.urlencoded({extended:false})); //Metodo urlencoded para utilizar y aceptar los formularios los datos que envie el usuario, falso para indicar que aceptare datos string, numericos es decir sencillos, sin imagenes etc.
app.use(express.json());                       // Aplicacion cliente para enviar y recibir JSON
// Inicializo y uso passport
app.use(passport.initialize()); // inicializo pero no sabe donde guardar los datos o como los manejara 
app.use(passport.session()); // Con esto passport funciona pero hay que requerir la definicion que hemos creado en authentication.js

/* --- Global Variables --- */
app.use( (req,res,next) => {  /*req: Informacion del usuario; res: lo que el servidor quiere responder, next: Continua con el codigo de abajo*/
    // Guardare en una variable global
    app.locals.success = req.flash('success'); // success nombre del mensaje que le di en links.js
    app.locals.message = req.flash('message');
    app.locals.user = req.user; // mi variable serializada user puede ser accedida desde cualquier vista 
    // Luego ya puedo usar esta variable success en cualquier vista de mi codigo
    next();
});

/* --- Routes --- */
console.log("Inicializando Rutas");
app.use(require('./routes/index')); // App utiliza lo que voy a requerir desde la carpeta routes el archivo index.js 
app.use(require('./routes/authentication')); // al declarar la ruta necesita un objeto enrutador
app.use('/links', require('./routes/links')); //Prefijo que aparecera antes de la ruta links

/* --- Public --- */ // Fuentes
console.log("Estableciendo Ruta estatica");
app.use(express.static(path.join(__dirname,'public'))); // Metodo express para indicar la ruta public

/* --- Start Server --- */
console.log("Starting server");
app.listen(app.get('port'), () => {
    console.log("Aplicacion iniciada en el puerto: ", app.get('port'));
}); 
