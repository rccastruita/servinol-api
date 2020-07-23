const purchaseModel = require('../models/purchase.model');
const purchaseItemModel = require('../models/purchase_item.model');

const purchaseController = {};

purchaseController.get = async (req, res) => {
    console.log("GET request at /purchases/" + req.params.id);

    try {
        var purchase = await purchaseModel.select(req.params.id);
        
        var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
            mod: 1,
            sub: purchase.user_id,
            minConditions: 1
        });
            
        if(isAuthorized !== true) {
            console.log("Access denied");
    
            if(isAuthorized == 'Token expired') {
                return res.status(401).send('Token expired');
            }
            return res.status(403).send("Forbidden");
        }
        
        
        purchase.products = await purchaseModel.getPurchaseItems(req.params.id);

        res.status(200).send(purchase);
        
    } catch(error) {
        console.error(error);

        res.status(500).send("Internal error");
    }
};

purchaseController.post = async (req, res) => {
    console.log("POST request at /purchases");

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        sub: req.body.user.id,
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
        var insertedPurchase = await purchaseModel.insert(req.body.user.id);
        insertedPurchase.purchase_items = [];

        for(var i=0; i<req.body.purchase_items.length; i++) {
            req.body.purchase_items[i].purchase_id = insertedPurchase.id;
            var insertedItem = await purchaseItemModel.insert(req.body.purchase_items[i]);
            insertedPurchase.purchase_items.push(insertedItem);
        }
        res.status(201).send(insertedPurchase);
        
    } catch(error) {
        console.error(error);

        res.status(500).send("Internal error");
    }
};

module.exports = purchaseController;