// Definir metodos de autenticacion

//Importo modulo passport
//Importarlo desde el index.js principal para poder usarlo
const passport = require('passport');

// En este caso de manera local. Propia base de datos
//const Strategy = require('passport-local').Strategy;
const LocalStrategy = require('passport-local');

//Requiero conexion con DB
const pool = require('../database');

// Requiero los modulos de cifrado
const helpers = require('../lib/helpers.js');

// Usar modulo passport y ejecutar metodo para SIGN IN
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username', // obtengo input username de la vista signin
    passwordFiel: 'password',  // obtengo input password de la vista signin
    passReqToCallback: true
}, async(req, username, password, done) =>{
    try{
        console.log('Metodo local.signin: Request,username y password');
        console.log(req.body);
        console.log(username);
        console.log(password);
        // Consulto en DB devuelvo un arreglo de objetos
        const rows = await pool.query ('SELECT * FROM users WHERE username = ?',[username]);
        console.log('resultado devuelto por DB');
        console.log(rows);

        if ( (rows.length > 0) || (rows.length = '') ){ // Consiguio el usuario 
            const user = rows[0]; // Le asigno solo el objeto no el arreglo
            console.log('consiguio el usuario');
            console.log('Valor password DB luego de asignarlo al objeto: ')
            console.log(user.password);
            console.log('Valor password TextoPlano luego de asignarlo al objeto: ')
            console.log(password);
            //Comparo el password plano con el almacenado en DB
            //Password textoplano vs Password DB
            const validPassword = await helpers.macthPassword(password,user.password); // Devuelve boolean
            console.log('Despues de comparar, valor para saber si son iguales: ',validPassword);
            
            // Valido la contraseña
            if (validPassword){
                // llamo a la funcion done para indicar que finalize y mando datos
                console.log('Correcto el inicio de sesion imprimo el usuario logueado: ',user);
                done(null,user,req.flash('success','Welcome ',user.username));
            }
            else{
                // indico que finalizo sin errores pero mando error
                done(null,false,req.flash('message','Incorrect Password. Try again'));
                return
            }
        }else{
            done(null,false,req.flash('message','The username does not exist.'));
        }
    }
    catch(error){
        console.log(error);
    }
}));

// Usar modulo passport y ejecutar metodo para SIGN UP
passport.use('local.signup', new LocalStrategy({
    //Que recibira 
    usernameField: 'username',
    passwordFiel: 'password', //Nombre dado en la vista name
    // Recibe parametro para poder recibir el objeto request dentro de esta funcion
    passReqToCallback: true // para poder pasar el objeto req
}, async (req, username, password, done) => { // Funcion que se ejecuta luego de LocalStrategy
    //Imprimo todo lo enviado en el req del body
    console.log(req.body);
    try {
        console.log('Metodo local.signup: Request,username y password');
        //const { fullname } = req.body; // fullname se encuentra en req.body
        // Opero con los datos
        const newUser = { // Defino un objeto nuevo
            username: username, //nombre que recibo de la vista 
            password: password,
            fullname: req.body.fullname
        };
        // Necesito cifrar los datos la clave
        // el objeto newUsers seleccionaremos la propiedad password y utilizaremos el metodo que creamos en helpers.js encryptPassword
        console.log('antesdecifrado',newUser.password);
        newUser.password =  await helpers.encryptPassword(password);
        console.log('passwordcifrado',newUser.password);
        
        //Inserto en la DB y capturo el resultado de la sentencia
        const result = await pool.query('INSERT INTO users SET ?', [newUser]); // Le envio el arreglo con los datos
        console.log('muestro resultado de la sentencia insertar usuario',result);
        
        // Asigno el ID que creo la sentencia y guarde en result
        newUser.id = result.insertId;
        return done(null,newUser); // devuelvo el newUser para que lo almacene en una session
    }
    catch (error) {
        console.log(error);
        return error;
    }
}));

// Documentacion de password requiere middlewares
// Se debe definir dos partes de password para serializarlo y desserializarlo

//Guarda el usuario ya creado en una sesion
passport.serializeUser((user,done) =>{
    done(null,user.id); // con el ID guardo en session
});

// Tomo el ID que he almacenado para volver a obtener los datos
passport.deserializeUser( async (id,done) =>{ // Hago consulta a la DB para comprobar que el ID existe al terminar la session
    try{
        //Guardo el resultado en constante
        const rows = await pool.query('SELECT * FROM users WHERE id = ?',[id]);
        // Devuelve un arreglo de objetos usar [0]
        return done(null, rows[0]);
    }
    catch(error){
        console.log(error);
        return;
    }
});