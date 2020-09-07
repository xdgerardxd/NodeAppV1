// Archivo que contendra metodos para manipular determinadas variables del codigo

// Creo una constante llamada helpers, sera objeto el cual tendra diversos metodos para utilziarlos en el codigo
const helpers = {};
// Importo modulo BCRYPT.js
const bcrypt = require('bcryptjs');

//Metodo para cifrar la contraseña helpers.NombrePropioDelMetodo

//Metodo del SingUP
helpers.encryptPassword = async(password) =>{ // Recibe password como valor en texto plano
    try{
        //Requiero importar el modulo de cifrado 
        //Guardo los saltos "string" generado en una constante
        console.log("Entro al metodo cifrar")
        console.log("Password Texto:",password);
        const salt = await bcrypt.genSalt(10); // Metodo para generar un hash o saltos. Recibe el numero de veces. Mientras mas veces mas seguro toma mas tiempo
        
        //Guardo el hash generado por el metodo
        const hash = await bcrypt.hash(password,salt); // Metodo para generar el hash. La clave en texto plano que va a convertir en base a la cadena de caracteres o saltos y El string o los saltos
        console.log("Antes de devolver, valor al cifrarlo: ",hash);
        return hash;
    }   
    catch (error){
        console.log(error);
        return error;
    }
 // Devuelvo la clave cifrada.
};

//Metodo para consultas cuando hacemos LogIn y comparar la contraseña

//Metodo del SignIn
helpers.macthPassword = async(password,savedPassword) =>{
    try{
        console.log("Entro al metodo comparar")
        console.log("Password Texto:",password,"Password DB: ",savedPassword);
        // Metodo compare. Recibe la contraseña y compara con la que ya tengo 
        //devuelve un boolean
        const validPassword = await bcrypt.compare(password,savedPassword);
        console.log("Antes de devolver, valor al compararlo: ",validPassword);
        return validPassword; // Devuelvo el boolean
    }
    catch(error){
        console.log(error);
        return error;
    } 
};

// Exporto el objeto
module.exports = helpers;