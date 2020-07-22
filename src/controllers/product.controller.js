const productModel = require('../models/product.model');
const moment = require('moment');
const productController = {};
const auth = require('../auth');

productController.get = async (req, res) => {
    console.log("GET product: " + req.params.id);

    var productModelResponse = await productModel.select(req.params.id);
    res.status(productModelResponse.code).json(productModelResponse.body);
};

productController.getAll = async (req, res) => {
    console.log("GET all products");

    var productModelResponse = await productModel.getAll();
    res.status(productModelResponse.code).json(productModelResponse.body);
};

productController.post = async (req, res) => {
    console.log("POST product");
    console.log("req.body: ");
    console.dir(req.body);

    auth.checkAuthorization(req.headers.authorization, {mod: 1}, async (error) => {
        if(error) {
            return res.status(error.code).send(error.body);
        }
        var product = req.body;
        if(!product.slug) {
            product.slug = "null";
        }
    
        if(!req.files || Object.keys(req.files).length === 0) {
            product.image = 'default.jpg';
        }
        else {
            
            var imageFile = req.files.image;
            var imageLocation = './resources/prod_img/_' + moment().unix() + "_" + imageFile.name;
            imageFile.mv(imageLocation, (error) => {
                if(error) {
                    return res.status(500).json(error);
                }
            });
    
            product.image = imageLocation;
        }
    
        var productModelResponse = await productModel.insert(req.body);
        res.status(productModelResponse.code).json(productModelResponse.body);
    });
};

productController.saveImage = async (image) => {

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