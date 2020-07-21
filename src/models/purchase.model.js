const mysqlConnection = require('../database');
const purchaseModel = {};

purchaseModel.getAll = async () => {
    return new Promise((resolve) => {
        mysqlConnection.query("SELECT * FROM purchase", [], 
        (error, results) => {
            if (error) {
                resolve({
                    code: 500,
                    body: {
                        message: "Internal error",
                        info: "An error ocurred while trying to retrieve the data.",
                        error: error
                    }
                });
            }
            else {
                resolve({
                    code: 200,
                    body: {
                        message: "Data retrieved",
                        info: "List of purchases retrieved.",
                        purchases: results
                    }
                });
            }
        });
    });
}

purchaseModel.insert = async (user_email) => {
    return new Promise((resolve) => {
        mysqlConnection.query(
            "INSERT INTO purchase (user_email) VALUES (?)", [user_email], 
            (error) => {
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
                            message: "Purchase registered",
                            info: "Purchase registered succesfully."
                        }
                    });
                }
            }
        );
    });
};

purchaseModel.select = async (id) => {
    return new Promise((resolve) => {
        mysqlConnection.query("SELECT * FROM purchase WHERE id = ?", [id], (error, results) => {
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
                        message: "Purchase found",
                        purchase: results[0]
                    }
                });
            }
            else {
                resolve({
                    code: 404,
                    body: {
                        message: "Not found",
                        info: "User not found in the database."
                    }
                });
            }
        });
    });
};

purchaseModel.update = async (purchase) => {
    return new Promise((resolve) => {
        mysqlConnection.query("UPDATE purchase SET purchase_timestamp = ? WHERE id = ?",
        [purchase.purchase_timestamp, purchase.id], (error) => {
            if(error) {
                resolve({
                    code: 500,
                    body: {
                        message: "Internal error",
                        info: "An error ocurred while trying to update the data.",
                        error: error
                    }
                });
            }
            else {
                resolve({
                    code: 200,
                    body: {
                        message: "Info updated",
                        info: "Purchase information updated succesfully."
                    }
                });
            }
        }
        )
    });
};

purchaseModel.delete = async (id) => {
    return new Promise((resolve) => {
        mysqlConnection.query("DELETE FROM purchase WHERE id = ?", [id], (error) => {
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
                        message: "Purchase deleted",
                        info: "The purchase register was deleted succesfully"
                    }
                });
            }
        });
    });
};

module.exports = purchaseModel;