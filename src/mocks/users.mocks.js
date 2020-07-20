const userModel = require('../models/user.model');
const random_name = require('node-random-name');
const bcrypt = require('bcrypt');


async function randomize_user(i) {
    return new Promise((resolve) => {
        var mock_user = {
            email: "",
            password: "",
            name: "",
            role: ""
        };
        var firstname = random_name({random: Math.random, first: true});
        var lastname = random_name({random: Math.random, last: true});
    
        mock_user.name = firstname + " " + lastname;
        mock_user.password = "mock" + i.toString();
        mock_user.email = firstname + "." + lastname.charAt(0) + i.toString() + "@mail.com";
        mock_user.role = "client";

        console.dir(mock_user);

        resolve(mock_user);
    });
}

async function generate_mock(mock) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(mock.password, 10, (err, hash) => {
            mock.password = hash;
            var response = userModel.insert(mock);
            resolve(response);
        });
        
    });
}

(async () => {
    for(var i=0; i<100; i++) {
        var mock = await randomize_user(i);
        var response = await generate_mock(mock);

        console.dir(response);
    }

})();