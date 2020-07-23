const cartModel = require('../models/cart.model');
const auth = require('../auth');

const cartController = {};

cartController.getAll = async (req, res) => {
    console.log("GET request at /cart");

    try {
        carts = await cartModel.getAll();
        res.status(200).send(carts);
    } catch(error) {
        console.error(error);
        res.status(500).send(error);
    }
};

cartController.get = async (req, res) => {
    console.log("GET request at /cart/" + req.params.userId);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        sub: req.params.userId,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied");

        if(isAuthorized == 'Token expired') {
            return res.status(401).send('Token expired');
        }
        return res.status(403).send("Forbidden");
    }
    
};

cartController.post = async (req, res) => {
    
};

cartController.put = async (req, res) => {
    
};

cartController.delete = async (req, res) => {
    
};

module.exports = cartModel;