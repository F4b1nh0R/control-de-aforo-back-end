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
  
async function valida_usuario(mail, clave)

  
  {try
    {   
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

  async function valida_nombre(mail) 
  {   try
      {   res = await bd.query(connection, "select idUsuario, nombre1, apellido1 from Usuario where mail = '"+mail+"'");
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

  async function registra_usuario(nom1,ape1,ape2,rut,mail, clave,secret)

  
  {try
    {   
        res = await bd.query(connection, "insert into Usuario (nombre1, apellido1, apellido2, rut, mail, clave, secreto, rango) values('"+nom1+"','"+ape1+"','"+ape2+"','"+rut+"','"+mail+"','"+clave+"','"+secret+"','0')");
        return(true);
       
    }
    catch
    {   console.log("Error en la función (registra_usuario) módulo de consultas: "+ err);        
        return (false);
    }
  }

  module.exports = {valida_usuario, valida_nombre, registra_usuario}