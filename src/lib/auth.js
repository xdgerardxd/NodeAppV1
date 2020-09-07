// Archivo para proteger rutas cuando el usuario no este logueado en el sistema y para prohibir rutas cuando ya este logueado
//Creo objeto para utilizar metodo y saber si esta log o no el usuario
module.exports = {
    // Metodo isLoggedIn and isNotLoggedIn
    // Reciben parametros de req,res y next
    // Rutas a prohibir si no esta logueado
    isLoggedIn(req,res,next){
        if (req.isAuthenticated()){ // Pregunto si esta autenticado, true: dejalo continuar con la peticion, falso redirijelo a logIn
            return next();
        }
        else{ // redirijo a signin si no esta autenticado o logueado
            return res.redirect('/signin')  
        }
    },
    // Rutas a evitar cuando ya este logIn
    isNotLoggedIn(req,res,next){
        // Esta autenticado entonces lo convierto en falso para que evitar rutas de log in y signup
        if (!req.isAuthenticated()){ // Si no esta autenticado dejalo continuar
            return next();
        }
        else{
            return res.redirect('profile'); // Si esta logueado no podra acceder a login o a signup
        }
    }
};

