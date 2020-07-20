const purchaseModel = require('../models/purchase.model');
const purchaseItemModel = require('../models/purchase_item.model');
const userModel = require('../models/user.model');
const productModel = require('../models/product.model');

(async () => {
    var userResponse = await userModel.getAll();
    var productResponse = await productModel.getAll();

    if (userResponse.code == 200 && productResponse.code == 200) {
        var users = userResponse.body.users;
        var products = productResponse.body.products;
        for(var i=0; i<50; i++) {
            mock_user = users[Math.floor(Math.random()*users.length)];

            await purchaseModel.insert(mock_user.email);
        }
        var purchaseResponse = await purchaseModel.getAll();
        var purchases = purchaseResponse.body.purchases;
        
        for(var i=0; i<50; i++) {
            purchases[i].purchase_timestamp = new Date();
            purchases[i].purchase_timestamp.setDate(Math.floor(Math.random()*28)+1);
            purchases[i].purchase_timestamp.setMonth(Math.floor(Math.random()*7));
            purchases[i].purchase_timestamp.setFullYear(2020);
            purchases[i].purchase_timestamp.setHours(Math.floor(Math.random()*24));
            purchases[i].purchase_timestamp.setMinutes(Math.floor(Math.random()*60));
            purchases[i].purchase_timestamp.setSeconds(Math.floor(Math.random()*60));

            await purchaseModel.update(purchases[i]);

            var j = Math.floor(Math.random()*5)+1;
            for(; j>0; j--) {
                var mock_product = products[Math.floor(Math.random()*products.length)];
                var mock_quantity = Math.floor(Math.random()*3)+1;
                mock_item = {
                    purchase_id: purchases[i].id,
                    product_id: mock_product.id,
                    quantity: mock_quantity
                };
                await purchaseItemModel.insert(mock_item);
            }
        }

    }
    else {
        console.error("ERROR ENCONTRADO");
    }
})();