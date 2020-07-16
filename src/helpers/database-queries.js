const mysqlConnection = require('../database');
const dbQueries = {};

dbQueries.executeProcedure = (procedureName, params) => {
    var query = 'CALL  '+procedureName+'(';
    for(var i = 0 ; i < params.length; i++){
        query += '?'+(i<params.length-1?', ':'');
    }
    query += ")";
    console.log(query);
    mysqlConnection.query(query, params, (err, results) => {
        if(!err){
            return "jisus craist";
        }else{
            return "holly shit";
        }
    });
}

module.exports = dbQueries;