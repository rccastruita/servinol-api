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
});