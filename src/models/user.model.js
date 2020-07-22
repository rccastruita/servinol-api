const mysqlConnection = require('../database');
const userModel = {};

userModel.insert = async (user) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "INSERT INTO user (email, password, name, role) VALUES (?, ?, ?, ?)",
            [
                user.email,
                user.password,
                user.name,
                user.role
            ], (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    console.log("Created user id: ", results.insertId);
                    user.id = results.insertId;
                    resolve(user);
                }
            }
        );
    });
};

userModel.getAll = async () => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM user", [], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
};

userModel.selectEmail = async (email) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM user WHERE email = ?", [email], 
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
        });
    });
};

userModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM user WHERE id = ?", [id],
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
        });
    });
};

userModel.update = async (id, data) => {
    return new Promise((resolve, reject) => {
        var query_string = "UPDATE user SET ";
        Object.keys(data).forEach((key) => {
            query_string += key + " = ?,";
        });
        
        query_string = query_string.substring(0, query_string.length-1) + " WHERE id = ?";
        query_data = Object.values(data);
        query_data.push(id);

        mysqlConnection.query(
            query_string,
            query_data, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            }
        );
    });
};

userModel.delete = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "DELETE FROM user WHERE id = ?",
            [id],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results.affectedRows);
                }
            }
        )
    });
};

module.exports = userModel;