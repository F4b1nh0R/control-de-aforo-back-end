
const jwt = require('jsonwebtoken');
const { makeDb } = require('mysql-async-simple');
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    port: '8400',
    user: 'root',
    password: '123456',
    database: 'mydb'
  });

  const bd = makeDb();
  bd.connect(connection);

async function valida_usuario(mail, clave){
    try
    {   console.log("ingresa a valida usuario");
        res = await bd.query(connection, "select 1 from Usuario where mail= '"+mail+"' AND clave='"+clave+"'");
        if(JSON.stringify(res) != "[]") 
            return true;
        else 
            return false;
       
    }
    catch
    {   console.log("Error en la función (valida_usuario) módulo de consultas: "+ err);        
        return false;
    }
}

/*async function valida_usuario(mail, clave)

  
  {try
    {   
        res = await bd.query(connection, "select secreto from Usuario where mail= '"+mail+"'");
        
        if(JSON.stringify(res) != "[]"){ 
            console.log('mail verificado');
            {try{
                resp = JSON.stringify(res);
                console.log('secretooo: ', JSON.stringify(resp));

                ver = await jwt.sign(clave, 'hola');
                console.log('pasa mail: '+ver)
                verifica = await bd.query(connection, "select 1 from Usuario where clave = '"+ver+"' ");
                if(JSON.stringify(verifica) != "[]") 
            
                {return true;}

            }

            catch{
                console.log('fallo posterior a la comprobación de mail')
                return false;
            }
            }
        }
        else{
            return false;
        }
       
    }
    catch
    {   console.log("Error en la función (valida_usuario) módulo de consultas: "+ err);        
        return false;
    }
  }

*/
async function valida_nombre(mail) 
  {   try
      {   res = await bd.query(connection, "select rango, nombre1, apellido1 from Usuario where mail = '"+mail+"'");
          if(JSON.stringify(res) != "[]")
          {   return res;
          }
          else
          {   return{message: "false"};
          }
      }
      catch(err)
      {   console.log("Error en la función (validar_username) módulo de consultas: "+ err);     
          return({message: "Error en la base de datos."}); 
      }
  }

async function registra_usuario(nom1,ape1,ape2,rut,mail, clave){



  console.log('entra a Registra usuario para, ', nom1, ape1);
  try
    {   
        res = await bd.query(connection, "insert into Usuario (nombre1, apellido1, apellido2, rut, mail, clave, rango) values('"+nom1+"','"+ape1+"','"+ape2+"','"+rut+"','"+mail+"','"+clave+"','0')");
    }
    catch
    {   console.log("Error en la función (registra_usuario) módulo de consultas: "+ err);       
        
    }
}

async function getId(mail){
    //mail = await jwt.verify(token, 'sesionToken');
    try{
        res = await bd.query(connection,"select idUsuario from Usuario where mail = '"+mail+"'")

        if(JSON.stringify(res) != '[]')
            return res;
        else
            return ({});
    }
    catch{
        console.log("error getId");
    }
}

async function reserva(token, idLaboratorio, fecha, idBloque){
    try{
        idu = await verifica_token(token);
        consulta1 = await verifica_disp_reserva(idu, fecha, idBloque, idLaboratorio);
        const resp = consulta1.message;
        console.log("respuesta de verifica_disp",consulta1.message);
        
        if(resp === "ok"){
        res = await bd.query(connection,"insert into Reserva (idBloque, fecha, idUsuario, idLaboratorio) values('"+idBloque+"', STR_TO_DATE('"+fecha+"','%Y-%m-%d'),'"+idu+"','"+idLaboratorio+"')");
        console.log("insert de reserva realizado");
        return ({message:'ok'});  
                    
    }
    else{        
        return consulta1;
    }
    }catch{
        return ({message:'Problemas de comunicación con la Base de Datos'});
    }
    
    
}

async function c1(idLaboratorio, fecha, idBloque){
    try{
    res1 = await bd.query(connection,"select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Reserva.idBloque, Reserva.idUsuario, Usuario.mail from Reserva "+
                                    " left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio "+
                                    " left join Usuario on Reserva.idUsuario = Usuario.idUsuario "+
                                    " where Reserva.fecha ='"+fecha+"' AND Reserva.idBloque = '"+idBloque+"' "+
                                    " AND Reserva.idLaboratorio = '"+idLaboratorio+"'");
                                    console.log(JSON.stringify(res1));
                                    return res1

                                }catch{
                                    console.log('error en c1');
                                    return({message:'Problemas de conexion a la BD'});
                                    
                                }
}

async function c2(idLaboratorio, fecha){
    try{
    res1 = await bd.query(connection,"select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Reserva.idBloque, Reserva.idUsuario, Usuario.mail from Reserva "+
                                    " left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio "+
                                    " left join Usuario on Reserva.idUsuario = Usuario.idUsuario "+
                                    " where Reserva.fecha ='"+fecha+"' "+
                                    " AND Reserva.idLaboratorio = '"+idLaboratorio+"'");
                                    console.log(JSON.stringify(res1));
                                    return res1

                                }catch{
                                    console.log('error en c2');
                                    return({message:'Problemas de conexion a la BD'});
                                    
                                }
}

async function c3(idLaboratorio, idBloque){
    try{
    res1 = await bd.query(connection,"select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Reserva.idBloque, Reserva.idUsuario, Usuario.mail from Reserva "+
                                    " left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio "+
                                    " left join Usuario on Reserva.idUsuario = Usuario.idUsuario "+
                                    " where Reserva.idBloque ='"+idBloque+"' "+
                                    " AND Reserva.idLaboratorio = '"+idLaboratorio+"' "+
                                    " AND Reserva.fecha between (current_date()) AND (ADDDATE(CURDATE()+0, INTERVAL 10 DAY))");
                                    console.log(JSON.stringify(res1));
                                    return res1

                                }catch{
                                    console.log('error en c3');
                                    return({message:'Problemas de conexion a la BD'});
                                    
                                }
}

async function c4(fecha, idBloque){
    try{
    res1 = await bd.query(connection,"select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Reserva.idBloque, Reserva.idUsuario, Usuario.mail from Reserva "+
                                    " left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio "+
                                    " left join Usuario on Reserva.idUsuario = Usuario.idUsuario "+
                                    " where Reserva.fecha ='"+fecha+"' "+
                                    " AND Reserva.idBloque = '"+idBloque+"' ");
                                    console.log(JSON.stringify(res1));
                                    return res1

                                }catch{
                                    console.log('error en c4');
                                    return({message:'Problemas de conexion a la BD'});
                                    
                                }
    
}

async function c5(idLaboratorio){

    console.log('idlab recibido', idLaboratorio);
    try{
    res1 = await bd.query(connection,"select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Reserva.idBloque, Reserva.idUsuario, Usuario.mail from Reserva "+
                                    " left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio "+
                                    " left join Usuario on Reserva.idUsuario = Usuario.idUsuario "+
                                    " where Reserva.idLaboratorio = '"+idLaboratorio+"' "+
                                    " AND Reserva.fecha between (current_date()) AND (ADDDATE(CURDATE()+0, INTERVAL 10 DAY))");
                                    console.log(JSON.stringify(res1));
                                    return res1

                                }catch{
                                    console.log('error en c5');
                                    return({message:'Problemas de conexion a la BD'});
                                    
                                }
    
}

async function c6(idBloque){
    try{
    res1 = await bd.query(connection,"select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Reserva.idBloque, Reserva.idUsuario, Usuario.mail from Reserva "+
                                    " left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio "+
                                    " left join Usuario on Reserva.idUsuario = Usuario.idUsuario "+
                                    " where Reserva.idBloque = '"+idBloque+"' "+
                                    " AND Reserva.fecha between (current_date()) AND (ADDDATE(CURDATE()+0, INTERVAL 10 DAY))");
                                    console.log(JSON.stringify(res1));
        return res1

    }catch{
        console.log('error en c6');
        return({message:'Problemas de conexion a la BD'});
        
    }
    
}
async function c7(fecha){
    try{
    res1 = await bd.query(connection,"select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Reserva.idBloque, Reserva.idUsuario, Usuario.mail from Reserva "+
                                    " left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio "+
                                    " left join Usuario on Reserva.idUsuario = Usuario.idUsuario "+
                                    " where Reserva.fecha = '"+fecha+"' ");
                                    console.log(JSON.stringify(res1));
        
        return res1

    }catch{
        console.log('error en c7');
        return({message:'Problemas de conexion a la BD'});
        
    }  
    
}




async function verifica_disp_reserva(idu, fecha, idBloque, idLaboratorio){
    res1 = await bd.query(connection,"select * from Reserva where fecha ='"+fecha+"' AND idBloque='"+idBloque+"' AND idLaboratorio = '"+idLaboratorio+"'");

    if(Object.keys(res1).length < 10){
        res2 = await bd.query(connection,"select * from Reserva where idUsuario = '"+idu+"' AND fecha ='"+fecha+"' AND idBloque='"+idBloque+"' AND idLaboratorio = '"+idLaboratorio+"'")
        console.log("reservas totales por el usuario:",Object.keys(res2).length);
        
        if(Object.keys(res2).length < 1){
            return ({message:'ok'});
        }else{
            return({message:'Ya tienes una reserva realizada para ese dia, laboratorio y bloque horario!'});}
            
    }else{
        return({message:'Ya se han ocupado todos los cupos para este laboratorio para ese dia y bloque horario'});
    }
        

}

async function ver_reservas(token){
    idu = await verifica_token(token);
    try{
        
        res = await bd.query(connection, "select Reserva.idReserva, Laboratorio.nombreLab, Reserva.fecha, Bloque.bloqueH, Reserva.idUsuario from Reserva left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio left join Bloque on Reserva.idBloque = Bloque.idBloque where Reserva.idUsuario = '"+idu+"' AND Reserva.fecha between (current_date()) AND (ADDDATE(CURDATE()+0, INTERVAL 10 DAY))");
        //res = await bd.query(connection,"select * from Reserva where idUsuario='"+idu+"'");
        if(JSON.stringify(res) != '[]'){
            
            return res;
        }
        else{
            return ({message:'nada'});
        }

    }catch{
        console.log('error en ver_reservas');
        return({message:'Problemas de conexion a la BD'});
        
    }

}

async function historial_reservas(token){
    idu = await verifica_token(token);
    try{
        
        res = await bd.query(connection, "select Laboratorio.nombreLab, Reserva.fecha, Bloque.bloqueH, Reserva.idUsuario from Reserva left join Laboratorio on Reserva.idLaboratorio = Laboratorio.idLaboratorio left join Bloque on Reserva.idBloque = Bloque.idBloque where Reserva.idUsuario = '"+idu+"' AND Reserva.fecha between (ADDDATE(CURDATE()+0, INTERVAL -10 DAY)) AND (ADDDATE(CURDATE()+0, INTERVAL -1 DAY))");
        //res = await bd.query(connection,"select * from Reserva where idUsuario='"+idu+"'");
        if(JSON.stringify(res) != '[]'){
            
            return res;
        }
        else{
            return ({message:'nada'});
        }

    }catch{
        console.log('error en ver_reservas');
        return({message:'Problemas de conexion a la BD'});
        
    }

}

async function consultita(){

    resp = await bd.query(connection, "SELECT informacion1, informacion2, informacion3 from Departamento where idDepartamento='1' ");
    return resp;
}

async function verifica_admin(token){
    console.log('entra a verificación de admin');
    mail = jwt.verify(token, 'sesionToken');
    console.log('token descifrado: ', mail)
    rango = await bd.query(connection,"select rango from Usuario where mail = '"+mail+"'");
    ran = rango[0]['rango']
    console.log('rango: ',ran);
    if(ran === 0){
        console.log('no es admin');
        return false;
    }
    else if(ran === 1){
        console.log('es admin');
        return true;
    }
    else{
        return false;
    }
}

async function eliminaReserva(idReserva){
    console.log('entra a eliminaRserva con',idReserva);
    try{
        resp = await bd.query(connection,"delete from Reserva where idReserva='"+idReserva+"'");
        if(JSON.stringify != '[]'){
            return true;
        }
        else{
            return false;
        }
        
        
    }
    catch{
        console.log('problemas en eliminaReserva');
    }   


}

async function verifica_token(token){
    console.log('entra a verifica token con', token);
    mail = jwt.verify(token, 'sesionToken');
    console.log('token decodificado: ',mail);
    idUsuario = await bd.query(connection,"select idUsuario from Usuario where mail = '"+mail+"'");
    idu = idUsuario[0]['idUsuario'];
    console.log(idu);
    return idu;
}
  module.exports = {valida_usuario, valida_nombre, registra_usuario, getId,reserva, ver_reservas, verifica_token, historial_reservas, consultita, verifica_admin, c1, c2, 
                    c3, c4, c5, c6, c7, eliminaReserva}