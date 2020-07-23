const productModel = require('../models/product.model');
const genreModel = require('../models/genre.model');
const auth = require('../auth');

const productController = {};

productController.get = async (req, res) => {
    console.log("GET product: " + req.params.id);

    try {
        var product = await productModel.select(req.params.id);
        res.status(200).send(product);
    }
    catch(error) {
        if(!error) {
            console.log("product not found");
            res.status(404).send("Not found");
        }
        else {
            console.error(error);
            res.status(500).send("Internal error");
        }
    }
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
            return res.status(401).send('Token expired');
        }
        return res.status(403).send("Forbidden");
    }

    var product = req.body;
    if(!product.slug) {
        product.slug = "/pending";
    }
    
    try {
        var createdProduct = await productModel.insert(req.body);
        console.log("Request successful");
        console.dir(createdProduct);
        
        await genreModel.addToProduct(createdProduct.id, createdProduct.categories);
        
        return res.status(201).send(createdProduct);
    } catch(error) {
        console.error(error);
        return res.status(500).send("Internal error");
    }
};

productController.put = async (req, res) => {
    console.log("PUT product");

    var isAuthorized = auth.checkAuthorization(req.headers.authorization, {
        mode:1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied");

        if(isAuthorized == 'Token expired') {
            return res.status(401).send('Token expired');
        }
        return res.status(403).send("Forbidden");
    }

    try {
        await productModel.update(req.params.id, req.body);
        console.log("Request successful");
        return res.status(204).send("");
    } catch(error) {
        console.error(error);
        return res.status(500).send("Internal error");
    }
};

productController.delete = async (req, res) => {
    console.log("DELETE product: " + req.params.id);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        mod: 1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied: " + isAuthorized);
        console.dir(isAuthorized);

        if(isAuthorized == "Token expired") {
            return res.status(401).send("Token expired");
        }

        return res.status(403).send("Forbidden");
    }

    try {
        var product = await productModel.select(req.params.id);

        await productModel.delete(req.params.id);
        console.log("Deleted");
        return res.status(204).send("");

    } catch(modelError) {
        if(!modelError) {
            console.log("Product not found");
            return res.status(404).send("Not found");
        }
        else {
            console.error(modelError);
            return res.status(500).send("Internal error");
        }
    }
};

module.exports = productController;