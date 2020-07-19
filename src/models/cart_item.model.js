const mysqlConnection = require('../database');
const cartItemModel = {};

cartItemModel.insert = (cartItem) => {
    mysqlConnection.query(
        "INSERT INTO cart_item (user_email, product_id, quantity) VALUES (?, ?, ?)",
        [
            cartItem.user_email,
            cartItem.product_id,
            cartItem.quantity
        ], (error) => {
            if(error) {
                console.error(error);
            }
        });
}

cartItemModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM cart_item WHERE id = ?", [id], (error, results) => {
            if (error) {
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
}

cartItemModel.update = (cartItem) => {
    mysqlConnection.query("UPDATE cart_item SET user_email = ?, product_id = ?, quantity = ?",
        [
            cartItem.user_email,
            cartItem.product_id,
            cartItem.quantity
        ], (error) => {
            console.error(error);
        });
}

cartItemModel.delete = (id) => {
    mysqlConnection.query("DELETE FROM cart_item WHERE id = ?", [id], (error) => {
        if(error) {
            console.error(error);
        }
    })
}