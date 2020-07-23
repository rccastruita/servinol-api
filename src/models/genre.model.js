const mysqlConnection = require('../database');
const genreModel = {};

genreModel.getAll = async () => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM genre", [], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}

genreModel.getAllFor = async (product_id) => {
    return new Promise((resolve, reject) => {
        query_string = "SELECT * FROM genre WHERE id IN ";
        query_string += "(SELECT genre_id FROM product_is_genre WHERE product_id = ?)";
        
        mysqlConnection.query(query_string, [product_id], (error, results) => {
            if(error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
};

genreModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM genre WHERE id = ?", [id], (error, results) => {
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

genreModel.insert = async (genre) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query('INSERT INTO genre(name) VALUES (?)', [genre.name], (error, results) =>{
            if(error) {
                reject(error);
            }
            else {
                genre.id = results.insertId;
                resolve(genre);
            }
        });
    });
};

genreModel.addToProduct = async (product_id, categories) => {
    return new Promise((resolve, reject) => {
        var query_string = "INSERT INTO product_is_genre (product_id, genre_id) VALUES ";
        categories.forEach((category) => {
            query_string += "(" + mysqlConnection.escape(product_id) + ", "
            + mysqlConnection.escape(category.id) + "),";
        });

        query_string = query_string.substring(0, query_string.length-1);
        
        mysqlConnection.query(query_string, (error) => {
            if(error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
};

genreModel.update = async (id, data) => {
    return new Promise((resolve, reject) => {
        var query_string = "UPDATE genre SET ";
        Object.keys(data).forEach((key) => {
            query_string += key + " = ?,";
        });

        query_string = query_string.substring(0, query_string.length-1) + " WHERE id = ?";
        query_data = Object.values(data);
        query_data.push(id);

        mysqlConnection.query(query_string, query_data, (error) => {
            if(error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
};

genreModel.delete = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("DELETE FROM genre WHERE id = ?", [id],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results.affectedRows);
                }
            }
        );
    });
};

module.exports = genreModel;