// Contiene las funciones de autenticacion
// Rutas de sing in sing out log in log out

const express = require('express');
const router = express.Router(); // Metodo para enviar rutas
//const passport = require('../lib/passport.js'); // Se pueden importar partes pero ya la definimos como middleware
const passport = require('passport');

// Importo los metodos creados en la funcion auth para proteger rutas
const { isLoggedIn, isNotLoggedIn } =  require('../lib/auth.js');

// Ruta SING UP
router.get('/signup', isNotLoggedIn, (req,res) =>{
    // Devuelvo vista signup
    res.render('./auth/signup.hbs'); // Devuelto vista SING UP
});

// Ruta SING IN
router.get('/signin', isNotLoggedIn, (req,res) =>{
    res.render('./auth/signin.hbs'); // Devuelvo vista SING IN
});

//Primer metodo enrutador 
// Recibir datos del form signup
// Encargado de utilizar el metodo de autenticacion
//*router.post('/signup',(req,res) =>{
//    // Proceso los datos en otro modulo passport.js. Usaremos modulo passport y passport-local
//    // Metodo authenticate toma el nombre del modulo que hemos creado
//    passport.authenticate('local.signup', { // metodo para redirijir cuando autentique
//        // Objeto de passport que redirije cuando todo este funcionando o salga mal
//        successRedirect: '/profile',
//        failureRedirect: '/signup', // redirije al signup cuando falle
//       failureFlash: true, // permite a passport recibir mensajes flash
//    });
//    // Devuelvo resultado.
//});

//Segundo metodo enrutador 
// Para funcionar hay que exportar toda la biblioteca de passport
//const passport = require('passport.js');

// Autenticar datos SIGN UP - Segundo Metodo
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup',{ // ejecuta el metodo local.signup y el valor devuelto sera exitoso o fallido
    successRedirect: '/profile',
    failureRedirect: '/signup', // redirije al signup cuando falle
    failureFlash: true, // permite a passport recibir mensajes flash
}));

// Autenticar datos SIGN IN - Primer Metodo
router.post('/signin', isNotLoggedIn, (req,res) =>{
    //llamo al metodo authenticate y le mando la direccion 'local.signin''
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    }) 
    (req,res); //Le paso req,res para validaciones
});

// Ruta Perfil usuario
router.get('/profile', isLoggedIn, (req,res) =>{
    res.render('profile');
    //res.render('./auth/profile.hbs');
})

// Ruta Logout
router.get('/logout', isLoggedIn, (req,res) =>{
    //Limpia la sesion y termina con la session del usuario
    req.logOut(); // Metodo passport para finalizar la sesion.
    res.redirect('/signin'); // redirijo a loguearse
});

// Exporto al src/index.js
module.exports = router;
