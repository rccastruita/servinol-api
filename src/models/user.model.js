const mysqlConnection = require('../database');
const userModel = {};

userModel.getAll = async () => {
    return new Promise((resolve) => {
        mysqlConnection.query("SELECT * FROM user", [], (error, results) => {
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
                    body: results
                });
            }
        });
    });
};

userModel.insert = async (user) => {
    return new Promise((resolve) => {
        mysqlConnection.query(
            "INSERT INTO user (email, password, name, role) VALUES (?, ?, ?, ?)",
            [
                user.email,
                user.password,
                user.name,
                user.role
            ], (error) => {
                if (error) {
                    resolve({
                        code: 500,
                        body: {
                            message: "Internal error", 
                            info: "An error ocurred while trying to submit the data",
                            error: error
                        }
                    });
                }
                else {
                    resolve({
                        code: 200,
                        body: {
                            message: "Registration complete",
                            info: "User account registered succesfully."
                        }
                    });
                }
            }
        );
    });
};

userModel.select = async (email) => {
    return new Promise((resolve) => {
        mysqlConnection.query("SELECT * FROM user WHERE email = ?", [email], 
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
                    body: results[0]
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

userModel.update = async (user) => {
    return new Promise((resolve) => {
        mysqlConnection.query(
            "UPDATE user SET password = ?, name = ?, role = ? WHERE email = ?",
            [
                user.password,
                user.name,
                user.role,
                user.email
            ], (error) => {
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
                            info: "User account information updated succesfully."
                        }
                    });
                }
            }
        );
    });
};

userModel.delete = async (email) => {
    return new Promise((resolve) => {
        mysqlConnection.query(
            "DELETE FROM user WHERE email = ?",
            [email],
            (error) => {
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
                            message: "User deleted",
                            info: "The user account was deleted succesfully"
                        }
                    });
                }
            }
        )
    });
};

module.exports = userModel;