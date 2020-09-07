// Contiene las funciones del motor de plantillas

//Importar de JSON la biblioteca timeago
//const timeago = require('timeago.js'); cambia, ya no es una funcion
const { format } = require('timeago.js'); // Estamos importando el metodo format de timeago1

// Instanciarlo o ejecutarlo
// devuelve una constancia y la guardo en una constante
// import { format, render, cancel, register } from 'timeago.js';
//const timeagoInstance = timeago; //sin parentesis porque el formato ha cambiado ya no es una funcion antes si, con parentesis da errorm, ver documentacion en: https://github.com/hustcc/timeago.js?files=1
//ya no hay que instanciarla porque ya no es una funcion

// Utilizar la instancia
// estoy creando un objeto para utilizar desde las vistas 
const helper = {}; // Creo una constante que contendra un objeto y lo importare para que este objeto sea utilizado por mi vista de handlerbars

//Creo el metodo del timeago que esta en el objeto
helper.timeago = (timestamp) => { //Metodo que al que llamare desde la vista
    return format(timestamp); // para devolver a las vistas que reconozca el formato timestamp
};

//Exportacion
module.exports = helper;