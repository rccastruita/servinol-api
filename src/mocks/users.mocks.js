const userModel = require('../models/user.model');

/*var foo = new User(
    'micorreo@mail.com',
    'contraseña',
    'fuckencio',
    'client'
);*/

var foo = {
    email: 'miotrocorreo@mail.com',
    password: 'password',
    name: 'trollencio',
    role: 'client'
}

//model.insertUser(foo);

userModel.selectUser('micorreo@mail.com');