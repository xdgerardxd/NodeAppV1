// Define las rutas de cada link mostrado - Contiene y almacena los enlaces o tareas del cliente
// Almacenaremos las cajas de enlaces que mostraremos en las vistas
// Importo la conexion de DB porque trabajare con consultas hacia la DB

const express = require('express'); 
const router = express.Router(); // Metodo para enviar rutas

// llamo a la conexion de DB
console.log("llamo a database");
const pool = require('../database');

// Modulo auth.js proteger rutas
const { isLoggedIn, isNotLoggedIn } =  require('../lib/auth.js');

// CREACION DE VISTAS (RUTAS)

//Vista localhost:4000/links/add
router.get('/add', isLoggedIn, (req,res) =>{
    res.render('./links/add.hbs'); // como la carpeta links esta fuera hay que agregarle el punto ./
    //res.send('VISTA ADD'); 
});

// Accion formulario add
// Para recibir datos se utiliza el objeto req.body 
// Nota: para esta version usar try and catch error para no generar error con la funcion async
router.post('/add', isLoggedIn, async (req, res) => {
    console.log("Antes de insertar un nuevo link, muestro el cuerpo de la peticion: ")
    console.log(req.body);          // recibe los atributos name colocados en el html 

    try {
        const { title, url, description } = req.body; // Guardo los datos en 3 constantes
        // Vuelvo a crear un objeto para enlazar este objeto con un usuario mas adelante
        //como el usuario ya esta en sesion me devuelve el id en el req.body
        const newLink = {
            title,
            url,
            description,
            user_id: req.user.id
        };

        console.log(newLink);
        //res.send('Su formulario se ha guardado correctamente.'); // Respuesta
        //Grabo en base de datos. Se puede utilizar promesas await o callback porque ya lo configuramos en database.js
        // En este caso utilizaremos await es decir la peticion tomara tiempo
        // Para funcionar la funcion debe tener nombre de async
        await pool.query('INSERT INTO links set ?', [newLink]); // set ? para crear un nuevo valor y , para pasarle lo siguiente
        // Muestro el la variable global mediante el metodo flash
        req.flash('success', 'Link guardado exitosamente.'); // Luego tengo que validar success para esto usar las variables globales
        res.redirect('/links'); //colocar nombre completo para no confundir con principal 
    } 
    catch (error) {
        console.log(error);
    }
    return;
});

// Vista link
//Vista localhost:4000/links
//CONSULTO BASE DE DATOS
router.get('/', isLoggedIn, async(req,res) =>{ // Antes del / precede el nombre o carpeta links
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id]); // guardo en una constante la lista de la consulta a la db y devuelvo los enlaces
    // devuelve un arreglo de objetos javascript, las propiedades son los campos de la DB
    //console.log(links);
    //res.send('el resultado: ')
    //Devuelve la vista y el arreglo en forma de lista
    res.render('links/list.hbs', {links: links}); // en ultimas versiones se puede usar {links}
}); 

// ELIMINO DATOS DE LA DB
router.get('/delete/:id', isLoggedIn, async(req,res) =>{
    console.log('Entro al darle clic al boton para eliminar');
    try{
        console.log(req.params.id); //metodo params para obtener el id
        const { id } = req.params; // Desde la vista solo necesito el id
        // id = ? para indicar que el parametro se lo voy a dar mediante un arreglo
        console.log('Antes de eliminar');
        console.log('ID: ',[id]); // entre corchetes o console.log(id);
        await pool.query('DELETE FROM links WHERE id = ?', [id]); // probar mandandolo asi  req.params.id
        console.log('realizo la consulta: ',[id]);
        // redirecciono a la vista anterior '/' links para que haga nuevamente la consulta a DB
        req.flash('success', 'Link eliminado.'); // Luego tengo que validar success para esto usar las variables globales
        res.redirect('/links');  // colocar ruta completa 
    } 
    catch(error){
        console.log(error); 
    }
    return;
});

// Creo metodo get edit para devolver la vista editar cuando me pida editar porque no se los datos. links/edit
router.get('/edit/:id',isLoggedIn, async(req,res) =>{
    console.log('Entro al darle clic al boton para modificar');
    try{
        console.log('Antes de consulta para obtener el id y el link que guarde');
        const {id} = req.params;
        //Consulto y guardo en variable todos los enlaces
        const links = await pool.query(" SELECT * FROM links WHERE id = ?", [id]);
        console.log('realizo la consulta y obtengo el link: ',id);
        // Devuelvo la vista editar 
        //console.log(links); // El query devuelto es un arreglo [] de objetos [{}]
        console.log(links[0]); // No quiero todo el arreglo tan solo un objeto, Para mostrarlo como solo objeto
        res.render('links/edit',{link: links[0]}); // le mando los datos a la vista de las consultas a la DB como objeto y no como arreglo
        //res.redirect('/links');   
    } 
    catch(error){
        console.log(error); 
    }
    return;
});

// Accion formulario edit
// Edito en la DB
router.post('/edit/:id',isLoggedIn, async (req, res) => { //:id para recibirlo
    try {
    const {id} = req.params; // asigno los parametros recibidos en la peticion // lo mando aparte en el query
    const { title, url, description } = req.body; // Guardo los datos en 3 constantes
        // Vuelvo a crear un objeto para enlazar este objeto con un usuario mas adelante
        const newLink = {
            title,
            url,
            description
        };

        console.log(newLink);
        // Modifico
        await pool.query("UPDATE links set ? WHERE id = ?", [newLink, id]); // set ? para crear un nuevo valor y , para pasarle lo siguiente
        // SOlicito a flash con el metodo req
        //Solicita dos parametros 1 el nombre como se guardara el mensaje y el valor del mensaje
        req.flash('success', 'Link editado correctamente.'); // Luego tengo que validar success para esto usar las variables globales
        res.redirect('/links'); //REdirijo a links con nuevos datos
   } 
    catch (error) {
        console.log(error);
    }
    return;
});

// Exporto al src/index.js
module.exports = router;
