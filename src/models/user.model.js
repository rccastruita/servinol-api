const mysqlConnection = require('../database');
const userModel = {};

userModel.select = (email) => {
    mysqlConnection.query("SELECT * FROM user WHERE email = ?", [email], (error, results, fields) => {
        if(error) {
            return undefined;
        }
        else {
            if (Array.isArray(results) && results.length > 0) {
                return results[0];
            }
            else {
                return undefined;
            }
        }
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
        ], (error, results, fields) => {
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