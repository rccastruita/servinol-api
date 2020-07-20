const mysqlConnection = require('../database');
const purchaseItemModel = {};

purchaseItemModel.insert = async (purchaseItem) => {
    return new Promise((resolve) => {
        mysqlConnection.query(
            "INSERT INTO purchase_item (purchase_id, product_id, quantity) VALUES(?, ?, ?)",
            [
                purchaseItem.purchase_id,
                purchaseItem.product_id,
                purchaseItem.quantity
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
                        code: 201,
                        body: {
                            message: "Registration complete",
                            info: "Purchase item registered succesfully."
                        }
                    });
                }
            }
        );
    });
};

purchaseItemModel.select = async (purchase_id, product_id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "SELECT * FROM purchase_item WHERE purchase_id = ? AND product_id = ?",
            [purchase_id, product_id],
            (error, results) => {
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
                            purchaseItem: results[0]
                        }
                    });
                }
                else {
                    resolve({
                        code: 404,
                        body: {
                            message: "Not found",
                            info: "Item not found in the database."
                        }
                    });
                }
            }
        );
    });
};

// purchaseItemModel.update -> not needed

/*purchaseItemModel.delete = (purchase_id, product_id) => {
    mysqlConnection.query(
        "DELETE FROM purchase_item WHERE purchase_id = ? AND product_id = ?",
        [purchase_id, product_id],
        (error) => {
            if(error) {
                console.error(error);
            }
        }
    );
};*/

module.exports = purchaseItemModel;