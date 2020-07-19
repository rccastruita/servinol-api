const userModel = require('../models/user.model');

var foo = {
    email: 'miotrocorreo@mail.com',
    password: 'password',
    name: 'trollencio',
    role: 'client'
};

//userModel.insert(foo);

// Async select test
(async () => {
    try {
        var foo = await userModel.select("miotrocorreo@mail.com");
        console.log(JSON.stringify(foo));
    }
    catch(error) {
        console.error("--- PROMISE REJECTED ---");
        console.error(error);
    }
})();

/* // password hash test
const bcrypt = require('bcrypt');
const saltRounds = 10;

const myPlainPassword = 'hola';

var myHash, mySalt;

bcrypt.genSalt(saltRounds, function(err, salt) {
    mySalt = salt;
    console.log('password: ' + myPlainPassword);
    console.log('salt: ' + salt);
    bcrypt.hash(myPlainPassword, salt, function(err, hash) {
        console.log('hash: ' + hash);
        myHash = hash;
        console.log('hash length: ' + myHash.length);

        console.log(bcrypt.compareSync('hola', myHash));
    });
});*/