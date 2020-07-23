const mysqlConnection = require('../database');
const purchaseModel = {};

purchaseModel.insert = async (user_id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "INSERT INTO purchase (user_id) VALUES (?)", [user_id], 
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

purchaseModel.getUserPurchaseHistory = async (user_id) => {
    return new Promise((resolve, reject) => {
        var sql_string = 
            "SELECT a.id, a.user_id, a.purchase_timestamp, SUM(b.price*c.quantity) AS total "
            + "FROM purchase AS a RIGHT JOIN purchase_item AS c ON a.id = c.purchase_id "
            + "JOIN product AS b ON c.product_id = b.id GROUP BY a.id "
            + "WHERE a.user_id = " + mysqlConnection.escape(user_id);

        mysqlConnection.query(sql_string, (error, results) => {
            if(error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
};

purchaseModel.getPurchaseItems = async (id) => {
    return new Promise((resolve, reject) => {
        var sql_string = "SELECT a.id, a.name, a.image, a.price, b.quantity, a.price*b.quantity subtotal "
        + "FROM product AS a JOIN purchase_item AS b ON a.id = b.product_id "
        + "WHERE b.purchase_id = " + mysqlConnection.escape(id);

        mysqlConnection.query(sql_string, (error, results) => {
            if(error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
};

purchaseModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        var sql_string = 
            "SELECT a.id, a.user_id, a.purchase_timestamp, SUM(b.price*c.quantity) AS total "
            + "FROM purchase AS a RIGHT JOIN purchase_item AS c ON a.id = c.purchase_id "
            + "JOIN product AS b ON c.product_id = b.id "
            + "WHERE a.id = " + mysqlConnection.escape(id)
            + "GROUP BY a.id "

        mysqlConnection.query(sql_string, (error, results) => {
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