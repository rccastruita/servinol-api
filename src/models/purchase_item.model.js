const mysqlConnection = require('../database');
const purchaseItemModel = {};

purchaseItemModel.insert = async (purchaseItem) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "INSERT INTO purchase_item (purchase_id, product_id, quantity) VALUES(?, ?, ?)",
            [
                purchaseItem.purchase_id,
                purchaseItem.product_id,
                purchaseItem.quantity
            ], 
            (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(purchaseItem);
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
                    reject(error);
                }
                else if (Array.isArray(results) && results.length > 0) {
                    resolve(results[0]);
                }
                else {
                    reject();
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