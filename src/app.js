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



// routes

//app.post(require('./routes/hola'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.get('/aforo',(req,res) =>{
    console.log('llega petición de aforo')
    
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
    lab1a=getRndInteger(5,10)
    lab2a=getRndInteger(9,10)
    lab3a=getRndInteger(1,1)
    lab4a=getRndInteger(9,10)
    lab5a=getRndInteger(0,0)
    lab6a=getRndInteger(0,0)
    lab7a=getRndInteger(2,2)
    //a={id:"1", cant:lab1a, aforo:"10"}
    
    d=[
        {id:"Licancabur",
        cant:lab1a,
        aforo:"10"
        },
        {id:"Socompa",
        cant:lab2a,
        aforo:"10"
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

app.post('/login', async (req, res) => {
    
   try
   {   console.log("Recieving ('/login') request: ", req.body);
       var mail = req.body.maillg;
       var clave = req.body.passlg;

       var resultado = await bd.valida_usuario(mail, clave);

       if(resultado)
       {   //console.log("resultado: "+resultado)
           const token = jwt.sign({maillg: req.body.maillg}, 'esto es secreto');
           res.send({message: "Login correcto!", token:token});
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
    
    try{
        
        console.log("Recieving ('/registro') request: ", req.body);
        var nom1 = req.body.nom1rg;
        var ape1 = req.body.ape1rg;
        var ape2 = req.body.ape2rg;
        var rut = req.body.rutrg;
        var mail = req.body.mailrg;
        var clave = req.body.passrg;
        var secret = req.body.secretrg;


        var resultado = await bd.registra_usuario(nom1,ape1,ape2,rut,mail, clave,secret);

        if(resultado)
       {   //console.log("resultado: "+resultado)
           res.send({message: "Registro correcto!"});
       }
       else
       {  
           res.status(400).json({message: "Registro incorrecto!"});
       }

    }
    catch(err){
        console.log("Error en la función (app.post('/registro', ...)) módulo: ", err);
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
    console.log(req)
    try{
    datos={message: 'Reserva recibida'};
    res.send(JSON.stringify(datos));
    
    }
    catch(err){
        console.log("Error llamando a /home: ", err)
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
