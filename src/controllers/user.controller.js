const userModel = require('../models/user.model');
const auth = require('../auth');

const userController = {};

userController.get = async (req, res) => {
    console.log("GET request to /users/" + req.params.email);
    
    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        sub: req.params.email,
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
        var user = await userModel.select(req.params.email);
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
        if(isAuthorized == "Conditions failed") {
            return res.status(403).send(isAuthorized);
        }
        if(isAuthorized == "Token expired") {
            return res.status(401).send(isAuthorized);
        }

        switch(isAuthorized.message) {
            case "Not enough or too many segments":
                console.log("Invalid token")
                break;
            default:
                console.log(isAuthorized.toString());
                break;
            }
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
        if(error.code === 'ER_DUP_ENTRY') {
            console.log("Request rejected: Duplicate email");
            res.status(400).send(error);
        }
        else {
            console.error(error);
            res.status(500).send("Request failed: Internal error");
        }
    }
}

userController.put = async (req, res) => {
    console.log("PUT request to /users/" + req.params.email);

    if(req.body.email) {
        console.log("Request rejected: Tried to update id");
        return res.status(400).send("Tried to update id");
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
            sub: req.params.email,
            mod: 1,
            minConditions: 1
        };

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, authorization_needed);
    
    if(isAuthorized !== true) {
        console.log("Access denied: " + isAuthorized);

        if(isAuthorized == "Token expired") {
            return res.status(401).send(isAuthorized);
        }

        return res.status(403).send(isAuthorized);
    }

    try {
        await userModel.update(req.params.email, req.body);
        console.log("Request successful");
        return res.status(204).send("");
    } catch(error) {
        console.error(error);
        return res.status(500).send("Request failed: Internal error");
    }

}

userController.delete = async (req, res) => {
    console.log("DELETE request on /users/" + req.params.email);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        sub: req.params.email,
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
        affectedRows = await userModel.delete(req.params.email);

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

module.exports = userController;