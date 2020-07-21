const mysqlConnection = require('../database');
const productModel = {};

productModel.getAll = async () => {
    return new Promise((resolve) => {
        mysqlConnection.query("SELECT * FROM product", [], (error, results) => {
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
                        info: "List of products retrieved.",
                        products: results
                    }
                });
            }
        });
    });
};

productModel.insert = async (product) => {
    return new Promise((resolve) => {
        mysqlConnection.query(
            "INSERT INTO product (name, description, price, slug, image) VALUES (?, ?, ?, ?, ?)",
            [product.name, product.description, product.price, product.slug, product.image],
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
                            message: "Registration complete",
                            info: "Product registered succesfully."
                        }
                    });
                }
            }
        );
    });
};

productModel.select = async (id) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query("SELECT * FROM product WHERE id = ?", [id], 
        (error, results, fields) => {
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
                        message: "Product found",
                        product: results[0]
                    }
                });
            }
            else {
                resolve({
                    code: 404,
                    body: {
                        message: "Not found",
                        info: "Product not found in the database."
                    }
                });
            }
        });
    });
};

productModel.update = async (product) => {
    return new Promise((resolve) => {
        mysqlConnection.query(
            "UPDATE product SET name = ?, description = ?, price = ?, slug = ?, image = ? WHERE id = ?",
            [product.name, product.description, product.price, product.slug, product.image, product.id],
            (error) => {
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
                            info: "Product information updated succesfully."
                        }
                    });
                }
        });
    });
};

productModel.delete = async (id) => {
    return new Promise((resolve) => {
        mysqlConnection.query("DELETE FROM product WHERE id = ?", [id],
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
                            message: "Product deleted",
                            info: "The product was deleted succesfully from the database."
                        }
                    });
                }
            }
        );
    });
};

module.exports = productModel;