/*const fs = require('fs');
const { makeDb } = require('mysql-async-simple');
const { JsonWebTokenError } = require('jsonwebtoken');
const { Interface } = require('readline');
const router = express.Router();

const mysqlConnection = require('./database');

let config = require('./config'); 



async function validar_usuario(email, password)
  {try
    {   res = await mysqlConnection.query("select 1 from Usuario where mail= '"+email+"' AND clave='"+password+"'");
        if(JSON.stringify(res) != "[]") return true;
        else return false;
       
    }
    catch
    {   console.log("Error en la función (validar_usuario) módulo de consultas: "+ err);        
        return false;
    }
  }
  async function valida_nombre(mail) 
  {   try
      {   res = await bd.query(connection, "select nombre1, apellido1 from Usuario where mail = '"+mail+"'");
          if(JSON.stringify(res) != "[]")
          {   return {message: "true"};
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

  module.exports = {validar_usuario, valida_nombre}*/