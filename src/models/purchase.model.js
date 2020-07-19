const mysqlConnection = require('../database');
const purchaseModel = {};

purchaseModel.insert = (user_email) => {
   mysqlConnection.query(
        "INSERT INTO purchase (user_email) VALUES (?)", [user_email], (error) => {
            if(error) {
                console.error(error);
            }
       }
   ); 
};

purchaseModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM purchase WHERE id = ?", [id], (error, results) => {
            if(error) {
                reject(error);
            }
            else {
                if(Array.isArray(results) && results.length > 0) {
                    resolve(results[0]);
                }
                else {
                    resolve(undefined);
                }
            }
        });
    });
};

// purchaseModel.update -> not needed

purchaseModel.delete = (id) => {
    mysqlConnection.query("DELETE FROM purchase WHERE id = ?", [id], (error) => {
        if(error) {
            console.error(error);
        }
    });
};