const productModel = require('../models/product.model');
const moment = require('moment');
const auth = require('../auth');
const constants = require('../constants');
const path = require('path');

const productController = {};

productController.get = async (req, res) => {
    console.log("GET product: " + req.params.id);

    var productModelResponse = await productModel.select(req.params.id);
    res.status(productModelResponse.code).json(productModelResponse.body);
};

productController.getAll = async (req, res) => {
    console.log("GET all products");

    try {
        products = await productModel.getAll();
        res.status(200).send(products);
    } catch(error) {
        console.error(error);
        res.status(500).send(error);
    }
};

productController.post = async (req, res) => {
    console.log("POST requested at /products");
    console.log("req.body: ");
    console.dir(req.body);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        mod: 1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied");

        if(isAuthorized == 'Token expired') {
            return res.status(401).send(isAuthorized);
        }
        res.status(403).send(isAuthorized);
    }

    var product = req.body;
    if(!product.slug) {
        product.slug = "/pending";
    }

    try {
        product.image = await productController.saveImage(req.files.image);
    } catch(error) {
        console.dir(error);
        return res.status('500').send(error);
    }
    
    try {
        var createdProduct = await productModel.insert(req.body);
        console.log("Request successful");
        console.dir(createdProduct);
        res.status(201).send(createdProduct);
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal error");
    }
};

productController.saveImage = async (image) => {
    return new Promise((resolve, reject) => {
        if(!image) {
            resolve(constants.PRODUCT_ID + '0000.jpg');
        }
        else {
            var imageRoute = 
                'images/products/' 
                + moment().unix() 
                + Math.floor(Math.random()*9000 + 1000).toString()
                + path.extname(image.name);
            
            image.mv('./resources/' + imageRoute, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(imageRoute);
                }
            });
        }
    });
}

productController.put = async (req, res) => {
    console.log("PUT product");

    auth.checkAuthorization(req.headers.authorization, {mod:1}, async (error) => {
        if(error) {
            return res.status(error.code).send(error.body);
        }

        var productModelResponse = await productModel.update(req.body);
        res.status(productModelResponse.code).json(productModelResponse.body);
    });
};

productController.delete = async (req, res) => {
    console.log("DELETE product: " + req.params.id);

    auth.checkAuthorization(req.headers.authorization, {mod:1}, async (error) => {
        if(error) {
            return res.status(error.code).send(error.body);
        }

        var productModelResponse = await productModel.delete(req.params.id);
        res.status(productModelResponse.code).json(productModelResponse.body);
    });

};

module.exports = productController;