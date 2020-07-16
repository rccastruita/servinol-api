const mysql = require('mysql');
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '8idfwcin',
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