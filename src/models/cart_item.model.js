const mysqlConnection = require('../database');
const cartItemModel = {};

cartItemModel.insert = async (cartItem) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "INSERT INTO cart_item (user_email, product_id, quantity) VALUES (?, ?, ?)",
            [
                cartItem.user_email,
                cartItem.product_id,
                cartItem.quantity
            ], (error) => {
                if (error) {
                    resolve({
                        code: 500,
                        body: {
                            message: "Internal error", 
                            info: "An error ocurred while trying to submit the data"
                        }
                    });
                }
                else {
                    resolve({
                        code: 200,
                        body: {
                            message: "Item added",
                            info: "Item added to the cart succesfully."
                        }
                    });
                }
            }
        );
    });
}

cartItemModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM cart_item WHERE id = ?", [id], (error, results) => {
            if(error) {
                resolve({
                    code: 500,
                    body: {
                        message: "Internal error",
                        info: "An error ocurred while trying to query the data"
                    }
                });
            }
            else if (Array.isArray(results) && results.length > 0) {
                resolve({
                    code: 200,
                    body: {
                        message: "Item found",
                        cartItem: results[0]
                    }
                });
            }
            else {
                resolve({
                    code: 404,
                    body: {
                        message: "Not found",
                        info: "Item not found in the cart."
                    }
                });
            }
        });
    });
}

cartItemModel.update = async (cartItem) => {
    return new Promise((resolve) => {
        mysqlConnection.query("UPDATE cart_item SET user_email = ?, product_id = ?, quantity = ?",
        [
            cartItem.user_email,
            cartItem.product_id,
            cartItem.quantity
        ], 
        (error) => {
            if(error) {
                resolve({
                    code: 500,
                    body: {
                        message: "Internal error",
                        info: "An error ocurred while trying to update the data."
                    }
                });
            }
            else {
                resolve({
                    code: 200,
                    body: {
                        message: "Info updated",
                        info: "Cart item information updated succesfully."
                    }
                });
            }
        });
    });
}

cartItemModel.delete = async (id) => {
    return new Promise((resolve) => {
        mysqlConnection.query("DELETE FROM cart_item WHERE id = ?", [id], (error) => {
            if(error) {
                if (error) {
                    resolve({
                        code: 500,
                        body: {
                            message: "Internal error",
                            info: "An error ocurred while trying to delete the data."
                        }
                    });
                }
                else {
                    resolve({
                        code: 200,
                        body: {
                            message: "Item removed",
                            info: "The item was removed from the cart succesfully"
                        }
                    });
                }
            }
        })
    });
}

module.exports = cartItemModel;