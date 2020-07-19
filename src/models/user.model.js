const mysqlConnection = require('../database');
const userModel = {};

userModel.select = async (email) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELCT * FROM user WHERE email = ?", [email], 
        (error, results) => {
            if(error) {
                reject(undefined);
            }
            else {
                if (Array.isArray(results) && results.length > 0) {
                    resolve(results[0]);
                }
                else {
                    console.log("not found");
                    resolve(undefined);
                }
            }
        });
    });
}

userModel.insert = (user) => {
    mysqlConnection.query(
        "INSERT INTO user (email, password, name, role) VALUES (?, ?, ?, ?)",
        [
            user.email,
            user.password,
            user.name,
            user.role
        ], (error) => {
            if (error) {
                console.log(error);
            }
        });
}

userModel.delete = (email) => {
    mysqlConnection.query(
        "DELETE FROM user WHERE email = ?",
        [email],
        (error, results, fields) => {
            if (error) {
                console.log(error);
            }
        }
    )
}

userModel.update = (user) => {
    mysqlConnection.query(
        "UPDATE user SET password = ?, name = ?, role = ? WHERE email = ?",
        [
            user.password,
            user.name,
            user.role,
            user.email
        ], (error, results, fields) => {
            if (error) {
                console.error(error);
            }
        }
    );
}

module.exports = userModel;