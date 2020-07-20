const productModel = require('../models/product.model');

(async () => {
    var mock = {
        name: "Game #0",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        price: 999.99,
        slug: "/game0",
        image: "example.jpg"
    };

    for(var i=0; i<100; i++) {
        mock.name = "Game #" + i.toString();
        mock.slug = "/game" + i.toString();
        mock.price = Math.floor(Math.random()*1000000) / 100;

        var response = await productModel.insert(mock);
        console.dir(response);
    }
})();