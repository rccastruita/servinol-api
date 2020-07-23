const userModel = require('../models/user.model');
const auth = require('../auth');
const bcrypt = require('bcrypt');

const userController = {};

userController.get = async (req, res) => {
    console.log("GET request to /users/" + req.params.id);
    
    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        sub: req.params.id,
        mod: 1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("isAuthorized: " + isAuthorized);
        if(isAuthorized == "Token expired") {
            return res.status(401).send("Token expired");
        }

        console.log("Request rejected: Permission denied");
        return res.status(403).send("Forbidden");
    }

    console.log("Request accepted");
    console.dir(isAuthorized);
    try {
        console.log("Request accepted");
        var user = await userModel.select(req.params.id);
        console.log("Request successful");
        res.status(200).send(user);
    } catch(error) {
        if(!error) {
            console.log('User not found...');
            res.status(404).send('User not found');
        }
        else {
            console.error(error);
            res.status(500).send("Request failed: Internal error");
        }
    }
}

userController.getAll = async (req, res) => {
    console.log("GET request to /users");

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        mod: 1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied: " + isAuthorized);

        if(isAuthorized == "Token expired") {
            return res.status(401).send("Token expired");
        }

        console.log(isAuthorized.toString());

        return res.status(403).send("Forbidden");
    }

    console.log("Request accepted");
    try {
        users = await userModel.getAll();
        console.log("Request successful");
        return res.status(200).send(users);
    } catch(error) {
        console.error(error);
        return res.status(500).send("Request failed: Internal error");
    }
}

userController.post = async (req, res) => {
    console.log("POST request to /users");

    var user = await auth.prepareUser(req.body);

    try {
        createdUser = await userModel.insert(user);
        console.log("Request successful");
        console.dir(createdUser);
        res.status(201).send(createdUser);
    } catch(error) {
        if(error.code === 'ER_BAD_NULL_ERROR') {
            console.log("Request rejected: Duplicate email");
            res.status(400).send("Duplicated email");
        }
        else {
            console.error(error);
            res.status(500).send("Internal error");
        }
    }
}

userController.put = async (req, res) => {
    console.log("PUT request to /users/" + req.params.id);

    if(req.body.id || req.body.email) {
        console.log("Request rejected: Tried to update fixed value");
        return res.status(400).send("Tried to update fixed value");
    }

    if(req.body.password) {
        req.body.password = await auth.hashPassword(req.body.password);
    }

    var authorization_needed;

    if(req.body.role)
        authorization_needed = {
            mod: 1,
            minConditions: 1
        };
    else 
        authorization_needed = {
            sub: req.params.id,
            mod: 1,
            minConditions: 1
        };

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, authorization_needed);
    
    if(isAuthorized !== true) {
        console.log("Access denied: " + isAuthorized);

        if(isAuthorized == "Token expired") {
            return res.status(401).send("Token expired");
        }

        return res.status(403).send("Forbidden");
    }

    try {
        await userModel.update(req.params.id, req.body);
        console.log("Request successful");
        return res.status(204).send("");
    } catch(error) {
        console.error(error);
        return res.status(500).send("Internal error");
    }

}

userController.delete = async (req, res) => {
    console.log("DELETE request on /users/" + req.params.id);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        sub: req.params.id,
        mod: 1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied: " + isAuthorized);

        if(isAuthorized == "Token expired") {
            return res.status(401).send(isAuthorized);
        }

        return res.status(403).send(isAuthorized);
    }
    
    console.log("Request accepted");
    try {
        affectedRows = await userModel.delete(req.params.id);

        if(affectedRows == 0) {
            console.log("Request failed: User not found");
            return res.status(404).send("User not found");
        }

        console.log("Request successful");
        return res.status(204).send("");

    } catch(error) {
        console.error(error);
        return res.status(500).send("Request failed: Internal error");
    }
}

userController.login = async (req, res) => {
    console.log("POST requested at /users/login");
    console.dir(req.body);

    try {
        var user = await userModel.selectEmail(req.body.email);
        console.log("User found for id: " + user.email);

        bcrypt.compare(req.body.password, user.password, (error, result) => {
            if(error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
            if(result) { // Correct password
                console.log("Authentication succesfull, sending token...");
                return res.status(200).json(auth.createToken(user));
            }
            else {  // Wrong password
                console.log("Wrong password");
                return res.status(401).json("Wrong credentials");
            }
        });
    } catch(error) {
        if(error) {
            console.error(error);
            return res.status(500).send(error);
        }
        else {
            console.log("User not found");
            return res.status(404).send("User not found");
        }
    }
};

module.exports = userController;