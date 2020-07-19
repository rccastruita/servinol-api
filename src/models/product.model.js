const mysqlConnection = require('../database');
productModel = {};

productModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM product WHERE id = ?", [id], 
        (error, results, fields) => {
            if(error) {
                reject(error);
            }
            else {
                if (Array.isArray(results) && results.length > 0) {
                    resolve(results[0]);
                }
                else {
                    resolve(undefined);
                }
            }
        });
    });
}

productModel.insert = (product) => {
    mysqlConnection.query(
        "INSERT INTO product (name, description, price, slug, image) VALUES (?, ?, ?, ?, ?)",
        [product.name, product.description, product.price, product.slug, product.image],
        (error) => {
            if(error) {
                console.log(error);
            }
    });
}

productModel.update = (product) => {
    mysqlConnection.query(
        "UPDATE product SET name = ?, description = ?, price = ?, slug = ?, image = ? WHERE id = ?",
        [product.name, product.description, product.price, product.slug, product.image, product.id],
        (error) => {
            if(error) {
                console.log(error);
            }
    });
}

productModel.delete = (id) => {
    mysqlConnection.query("DELETE FROM product WHERE id = ?", [id],
    (error) => {
        if(error) {
            console.log(error);
        }
    });
}

module.exports = productModel;