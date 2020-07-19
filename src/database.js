const mysql = require('mysql');
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'adminTienda',
    password: 'passwordTienda',
    database: 'onlineStore'
})

mysqlConnection.connect((err) => {
    if(err){
        console.log(err);
        return;
    }else{
        console.log("DB Connected");
    }
})

module.exports = mysqlConnection;