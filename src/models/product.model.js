const mysqlConnection = require('../database');
const productModel = {};

productModel.insert = async (product) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(
            "INSERT INTO product (name, description, price, slug, image) VALUES (?, ?, ?, ?, ?)",
            [product.name, product.description, product.price, product.slug, product.image],
            (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                else {
                    product.id = results.insertId;
                    resolve(product);
                }
            }
        );
    });
};

productModel.getAll = async () => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM product", [], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
};

productModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM product WHERE id = ?", [id], 
        (error, results, fields) => {
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

productModel.update = async (id, data) => {
    return new Promise((resolve, reject) => {
        var query_string = "UPDATE product SET ";
        Object.keys(data).forEach((key) => {
            query_string += key + " = ?,";
        });

        query_string = query_string.substring(0, query_string.length-1) + " WHERE id = ?";
        query_data = Object.values(data);
        query_data.push(id);

        mysqlConnection.query(
            query_string, query_data, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve();
                }
        });
    });
};

productModel.delete = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("DELETE FROM product WHERE id = ?", [id],
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

module.exports = productModel;