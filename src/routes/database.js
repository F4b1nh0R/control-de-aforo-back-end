
const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    port: '8400',
    user: 'root',
    password: '123456',
    database: 'mydb',
    multipleStatements: true
});

mysqlConnection.connect(function (err){
    if (err){
        console.error(err);
        return;
        
    } else{
        console.log('bd conectada');
    }
});

module.exports = mysqlConnection;