const mysqlConnection = require('../database');
const cartModel = {};

cartModel.insert = async (cart) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "INSERT INTO cart_item (user_email, product_id, quantity) VALUES (?, ?, ?)",
            [
                cart.user_email,
                cart.product_id,
                cart.quantity
            ], (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    cart.id = results.insertId;
                    resolve(cart);
                }
            }
        );
    });
}

cartModel.getAll = async() => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM cart_item", (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
};

cartModel.getUserCart = async(user_id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM cart_item WHERE user_id = ?", 
            [user_id], (error, results) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
    });
};

cartModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM cart_item WHERE id = ?", [id], (error, results) => {
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
}

cartModel.update = async (id, data) => {
    return new Promise((resolve, reject) => {
        var query_string = "UPDATE cart_item SET ";
        Object.keys(data).forEach((key) => {
            query_string += key + " = ?,";
        });

        query_string = query_string.substring(0, query_string.length-1) + " WHERE id = ?";
        query_data = Object.values(data);
        query_data.push(id);

        mysqlConnection.query(query_string, query_data, (error, results) => {
            if(error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}

cartModel.delete = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("DELETE FROM cart_item WHERE id = ?", [id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results.affectedRows);
            }
        })
    });
}

module.exports = cartModel;