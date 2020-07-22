const mysqlConnection = require('../database');
const purchaseModel = {};

purchaseModel.insert = async (user_email) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "INSERT INTO purchase (user_email) VALUES (?)", [user_email], 
            (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    mysqlConnection.query("SELECT * FROM purchase WHERE id = ?",
                    [results.insertId], (nested_error, nested_results) => {
                        resolve(nested_results[0]);
                    });
                }
            }
        );
    });
};

purchaseModel.getAll = async () => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM purchase", [], 
        (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}

purchaseModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM purchase WHERE id = ?", [id], (error, results) => {
            if(error) {
                reject(error);
            }
            else if (Array.isArray(results) && results.length > 0) {
                resolve(results[0]);
            }
            else {
                reject();
            }
        });
    });
};

purchaseModel.update = async (id, data) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("UPDATE purchase SET purchase_timestamp = ? WHERE id = ?",
        [data, id], (error) => {
            if(error) {
                reject(error);
            }
            else {
                resolve();
            }
        }
        )
    });
};

purchaseModel.delete = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("DELETE FROM purchase WHERE id = ?", [id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.affectedRows);
            }
        });
    });
};

module.exports = purchaseModel;