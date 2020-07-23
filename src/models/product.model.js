const mysqlConnection = require('../database');
const genreModel = require('./genre.model');
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
        mysqlConnection.query("SELECT * FROM product", [], async (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                try {
                    for(var i=0; i<results.length; i++) {
                        results[i].categories = await genreModel.getAllFor(results[i].id);

                    }
                } catch(categoriesError) {
                    reject(categoriesError);
                }
                
                resolve(results);
            }
        });
    });
};

productModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM product WHERE id = ?", [id], 
        async (error, results) => {
            if(error) {
                reject(error);
            }
            else if (Array.isArray(results) && results.length > 0) {
                console.dir(results[0]);
                try {
                    results[0].categories = await genreModel.getAllFor(results[0].id);
                    resolve(results[0]);
                } catch(categoriesError) {
                    reject(categoriesError);
                }
            }
            else {
                reject();
            }
        });
    });
};

productModel.update = async (id, data) => {
    return new Promise((resolve, reject) => {
        if(data.categories) {
            var delete_string = "DELETE FROM product_is_genre WHERE product_id = ";
            delete_string += mysqlConnection.escape(id) + " AND genre_id NOT IN ";

            var categories_string = "("
            data.categories.forEach((category) => {
                categories_string += mysqlConnection.escape(category.id) + ",";
            });
            categories_string = categories_string.substring(0, categories_string.length-1) + ")";

            delete_string += categories_string;
            mysqlConnection.query(delete_string , (error) => {
                if(error)
                    reject(error);
            })

            insert_string = "INSERT INTO product_is_genre(product_id, genre_id) "
            + "(SELECT "+mysqlConnection.escape(id)+" product_id, "
            + "g.id FROM genre g WHERE g.id NOT IN (SELECT genre_id FROM product_is_genre WHERE product_id = "
            + mysqlConnection.escape(id)+") AND g.id IN" + categories_string;

            mysqlConnection.query(insert_string, (error) => {
                if(error)
                    reject(error);
            });
            delete data.categories;
        }

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