import express from 'express'
import sessions from 'express-sessions'

const app = express();

//Configuracion del middleware de sessions

app.use(session({
    secret : 'p3-JFFA#lost-sesionespersistentes', 
    resave: false,
    saveUninitialized : true,
    cookie : {maxAge: 24 * 60 * 60 *100} //1 Día
})
);

//Ruta para inicializar la sesion

app.get('/Iniciar-Sesion', (req,res) =>{
    if (!req.session.inicio){
        req.session.inicio =  new Date();// Fecha de inicio de la sesion
        req.session.ultimoAcceso =  new Date();//Fecha ultima consulta inicial
    }else{
        res.render('La sesion ya esta activa');
    }
});

//Ruta para actualizar la ultima consulta
app.get('/actualizar' , (req,res)=>{
    if(req.session.inicio){
        req.session.ultimoAcceso = new Date();
        res.render('Fecha de ultima consulta actualizada');
    }else{
        res.render('No hay una sesion activa');
    }
})

// Ruta para ver el estado de la sesion
app.get('/estado-sesion',(req,res)=>{
    if(req.session.inicio){
        const inicio = req.session.inicio
        const ultimoAcceso = req.session.ultimoAcceso
        const hora = new Date()
        //Calcular la antiguedad de la sesiom
        const antiguedaMs = hora-inicio;
        const horas = Math.floor(antiguedaMs / ((100*60*60)));
        const minutos = Math.floor(antiguedaMs % ((100*60*60) / (100*60)));
        const segundos = Math.floor(antiguedaMs % ((100*60*60))/1000);

        res.json({
            mensaje : 'Estado de la sesión',
            sesionId : req.sesionId,
            inicio : inicio.toISOString(),
            antiguedad: `${horas} horas , ${minutos} minutos ,${segundos} segundos`
        })
    }else{
        res.render('No hay una sesion activa')
    }
})

//Ruta para cerrar la sesion
app.get('/cerrar-session',(req,res)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).send('Error al cerrar la Sesion')
            }
            res.send('Sesion cerrada correctamente')
        })
    }else{
        res.send('No hay una sesion activa para crear')
    }
})

//Iniciar el servidor
app.listen(PORT,() => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
})