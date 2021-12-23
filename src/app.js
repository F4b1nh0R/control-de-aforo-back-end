const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const mysqlConnection = require('./routes/database');
const bd = require('./routes/consulta.js')
const bodyParser = require('body-parser');
const nodemon = require('nodemon');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { json } = require('express/lib/response');
const { decodeBase64 } = require('bcryptjs');

// Settings
app.set('port', process.env.PORT || 3333);
app.set ('json spaces', 2);

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
dotenv.config({path:'./env/.env'});

app.use('/resources', express.static('public'));
app.set('/resources', express.static(__dirname + '/public'));

// laboratorios

var lab1a = 0;
var lab2a = 0;
var lab3a = 0;
var lab7a = 0;
var aforomax1 = 10;
var aforomax2 = 10;

// routes

//app.post(require('./routes/hola'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.post('/acumulador',(req,res) => {
    
    try{
        console.log("Recibe ('/acumulador'): ", req.body);
        if (req.body.lab == 1){
            lab1a = req.body.value;
            console.log("nuevo valor lab1a: ", lab1a);
            resp= {message: 'recibido'}
            res.send(resp)
        }
        else{
            lab2a = req.body.value;
            console.log("nuevo valor lab2a: ",req.body.lab, lab2a);
            resp= {message: 'recibido'}
            res.send(resp)
        }
    }catch(err)
    {   console.log("Error en la función /acumuador: ", err);
            resp= {message: 'error x.x'}
            res.send(resp)
    }
})
app.get('/aforo',(req,res) =>{
    console.log('llega petición de aforo')
    
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
    //lab1a=getRndInteger(5,10)
    //lab2a=getRndInteger(9,10)
    //lab3a=getRndInteger(1,1)
    lab4a=getRndInteger(9,10)
    lab5a=getRndInteger(0,2)
    lab6a=getRndInteger(0,10)
    //lab7a=getRndInteger(5,30)
    //a={id:"1", cant:lab1a, aforo:"10"}
    
    d=[
        {id:"Licancabur",
        cant:lab1a,
        aforo:aforomax1
        },
        {id:"Socompa",
        cant:lab2a,
        aforo:aforomax2
        },
        {id:"Azufre",
        cant:lab3a,
        aforo:"10"
        },
        {id:"Guallatire",
        cant:lab4a,
        aforo:"10"
        },
        {id:"Parinacota",
        cant:lab5a,
        aforo:"10"
        },
        {id:"Pomerape",
        cant:lab6a,
        aforo:"10"
        },
        {id:"Auditorio",
        cant:lab7a,
        aforo:"30"
        },
    ];
    res.send(d)

    
});
app.get('/dpto2',(req, res) =>{
   mysqlConnection.query('SELECT * FROM Departamento', (err, rows, fields) =>{
       if(!err){
           res.json(rows);
       } else {
           console.log(err);
       }
   });  
});

app.get('/consulta', async (req, res) => {
    try{
        var consulta = await bd.consultita();
        resp = {
            informacion1:consulta[0]['informacion1'],
            informacion2:consulta[0]['informacion2'],
            informacion3:consulta[0]['informacion3']
        };

        res.send(consulta);
    }catch{
        resp = {message:'Problemas de conexión'}
        res.send(resp);
    }
    

})

app.post('/login', async (req, res) => {
    
    try
    {   console.log("Recieving ('/login') request: ", req.body);
        var mail = req.body.maillg;
        var clave = req.body.passlg;
 
        var resultado = await bd.valida_usuario(mail, clave);
 
        if(resultado)
        {   //console.log("resultado: "+resultado)
            
            datos = await bd.valida_nombre(mail);
            const token = jwt.sign(mail, 'sesionToken');
            resp = {
                rango:datos[0]['rango'],
                nombre1:datos[0]['nombre1'],
                apellido1:datos[0]['apellido1'],
                token:token
            };
            console.log('resp: ',resp);
            res.send(resp);
        }
        else
        {  
            res.status(400).json({message: "Login incorrecto!"});
        }
    }
    catch(err)
    {   console.log("Error en la función (app.post('/login', ...)) módulo: ", err);
    }
 })


 

app.post('/registro', async (req, res) => {

    console.log("Recieving ('/registro') request: ", req.body);
        var nom1 = req.body.nom1rg;
        var ape1 = req.body.ape1rg;
        var ape2 = req.body.ape2rg;
        var rut = req.body.rutrg;
        var mail = req.body.mailrg;
        var clave = req.body.passrg;
    
    try{
        
        await bd.registra_usuario(nom1,ape1,ape2,rut,mail,clave);
        res.send({message:'Registrado Correctamente!'});

    }
    catch(err){
        console.log("Error en la función (app.post('/registro', ...)) módulo: ", err);
        res.send({message: 'Usuario ya existe !'});
    }
})

app.post('/home', async (req, res) => {
    console.log(req)
    try{
    var datos = await verifyToken(req.body.token)
    if(datos != "[]"){
        console.log("resp: "+JSON.stringify(datos))
        res.send(JSON.stringify(datos));
    }
    else{
        res.status(400).json({message: "usuario invalido!"});
    }
    
    }
    catch(err){
        console.log("Error llamando a /home: ", err)
    }
})

app.post('/reserva', async (req, res) => {
    try{
        reserva = await bd.reserva(req.body.token, req.body.laboratorio, req.body.fecha, req.body.bloqueH)
        console.log("reserva: ",reserva.message);
        if(reserva.message === "ok"){
            res.send({message:"Reserva realizada!"});
        }
        else{
            console.log('falló la reserva: ',reserva);
            res.send(reserva);
        }
    
    }
    catch(err){
        console.log("Error llamando a /reserva: ", err)
    }
})

app.post('/eliminareserva', async (req, res) => {
    console.log('entra a Elimina Reserva');
    try{
        
        resp = await bd.eliminaReserva(req.body.idReserva)
        if(resp){
            console.log('se recibe',resp);
            res.send({message:'Reserva Eliminada'});
        }
        else{
            res.send({message:'No se pudo eliminar la reserva'})
        }
        
    
    }
    catch(err){
        console.log("Error llamando a eliminaReserva: ", err)
        res.send({message:'Problemas de conexión con la base de datos'})
    }
})

app.post('/misreservas', async(req, res) =>{

    try{        
        reservas = await bd.ver_reservas(req.body.token);
        if(reservas.message === "nada"){
            res.send({message:'No tienes reservas realizadas D:'});
        }
        else{
            res.send(reservas);
        }
    }
    catch{
        res.send({message:'problemas de conexión con la Base de Datos'});
    }

})

app.post('/historialreservas', async(req, res) =>{

    try{        
        reservas = await bd.historial_reservas(req.body.token);
        if(reservas.message === "nada"){
            res.send({message:'No tienes reservas realizadas D:'});
        }
        else{
            res.send(reservas);
        }
    }
    catch{
        res.send({message:'problemas de conexión con la Base de Datos'});
    }

})
app.post('/moda',async(req, res)=>{
    console.log('se recibe desde /moda ', req.body);

    if(req.body.nombreLab === 'Licancabur'){
        aforomax1 = req.body.nuevoAforo;
    }
    res.send({message:'Aforo Modificado'});
})


app.post('/modr', async(req, res) =>{

    try{        
        verificacion = await bd.verifica_admin(req.body.token);
        if(verificacion){
            console.log('entra a los ciclos');
            if(req.body.idLaboratorio === ''){

                if(req.body.fecha === ''){
                  if(req.body.idBloque === ''){
                      //nada de nada
                  }
                  else{
                    //envía la consulta sólo con idBolque
                    
                    console.log("intenta C6");
                    resp = await bd.c6(req.body.idBloque)
                    if(JSON.stringify(resp) != '[]'){
                        return res.send(resp);
                    }
                    else{
                    return res.send({message:'No hay reservas registradas para este bloque horario en los proximos 10 días'});
                    }
                    
                  }
          
                }
                else{
                  if(req.body.idBloque === ''){
                    //envía consulta solo con fecha.
                    
                    console.log("intenta C7");
                    resp = await bd.c7(req.body.fecha)
                    if(JSON.stringify(resp) != '[]'){
                        return res.send(resp);
                    }
                    else{
                        return res.send({message:'No hay reservas para esta fecha'});
                    }
                    
                  }
                  else{
                    //envía la consulta con fecha + bloque
                    
                    console.log("intenta C4");
                    resp = await bd.c4(req.body.fecha, req.body.idBloque)
                    if(JSON.stringify(resp) != '[]'){
                        return res.send(resp);
                    }
                    else{
                        return res.send({message:'No hay reservas para esta fecha y bloque'});
                    }
                    
                  }
                }
            }
            else{
                if(req.body.fecha ===''){
                  if(req.body.idBloque === ''){
                    //envía consulta sólo con lab
                    
                    console.log("intenta C5 con: ",req.body.idLaboratorio);
                    resp = await bd.c5(req.body.idLaboratorio)
                    if(JSON.stringify(resp) != '[]'){
                        return res.send(resp);
                    }
                    else{
                        return res.send({message:'No hay reservas registradas para este laboratorio en los proximos 10 días'});
                    }
                    
                  }
                  else{
                      //se envia consulta con lab y bloque
                      
                    console.log("intenta C3");
                    resp = await bd.c3(req.body.idLaboratorio, req.body.idBloque)
                    if(JSON.stringify(resp) != '[]'){
                        return res.send(resp);
                    }
                    else{
                        return res.send({message:'No hay reservas registradas para este laboratorio y bloque en los proximos 10 días'});
                    }
                  }
                }
                else{
                  if(req.body.idBloque === ''){
                    console.log("intenta C2");
                    //envía consulta con lab y fecha
                    resp = await bd.c2(req.body.idLaboratorio, req.body.fecha)
                    if(JSON.stringify(resp) != '[]'){
                        return res.send(resp);
                    }
                    else{
                        return res.send({message:'No hay reservas para este laboratorio en la fecha indicada'});
                    }
          
                  }
                  else{
                    //envía consulta con f1 f2 y f3
                    
                    console.log("intenta C1");
                    resp = await bd.c1(req.body.idLaboratorio, req.body.fecha, req.body.idBloque)
                    if(JSON.stringify(resp) != '[]'){
                        return res.send(resp);
                    }
                    else{
                        return res.send({message:'No hay reservas para este laboratorio en la fecha y bloque indicados'});
                    }
                    
                  }
          
                }
            }
            
        }
        else{
            res.send({message:'NO tienes los privilegios suficientes para realizar esta operación'})
        }
    }
    catch{
        res.send({message:'problemas de conexión con la Base de Datos'});
    }

})

//app.use(require('./routes/index'));
//app.use(require('./routes/dpto'));

// Config Cors
app.use((req, res, next) => {
   console.log("Quién es: ", req.headers.origin);
   res.header('Access-Control-Allow-Origin', req.headers.origin);
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DEvarE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DEvarE');
   res.header("Access-Control-Allow-Credentials", true);
   next();
});

async function verifyToken(token)
{   try
    {   console.log(jwt.verify(token, 'esto es secreto').maillg);
        var verificacion = jwt.verify(token, 'esto es secreto').maillg
        datos = await bd.valida_nombre(verificacion);
        return datos;
    }
    catch(err)
    {   console.log("Error en la función (verifyToken) módulo index: ", err);
        return ({message: "false"});
    }
}


//Iniciando server
app.listen(app.get('port'), () => {
    console.log("Server on port", app.get('port'));

});
