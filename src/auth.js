const bcrypt = require('bcrypt');
const userModel = require('./models/user.model');
const jwt = require('jwt-simple');
const moment = require('moment');

const TOKEN_SECRET = "jvvL7rdRr1xBjETS79Wh";
const FORBIDDEN = {
    code: 403,
    body: {
        message: "Forbidden",
        info: "Access denied."
    }
}
const EXPIRED = {
    code: 401,
    body: {
        message: "Token expired", 
        info: "The current session has expired, please login again."
    }
}



auth = {};

auth.prepareUser = async (user) => {
    return new Promise((resolve) => {
        bcrypt.hash(user.password, 10, (err, hash) => {
            user.password = hash;

            resolve(user);
        });
    });
};

auth.login = async (req, res) => {
    var userGetResponse = await userModel.select(req.body.email);

    if(userGetResponse.code == 200) {
        const user = userGetResponse.body;

        bcrypt.compare(req.body.password, user.password, (error, result) => {
            if(result) {
                console.log("Authentication succesfull, sending token...");
                res.status(200).json(auth.createToken(user));              
            }
            else {
                console.log("Wrong password");
                res.status(401).json({
                    message: "Invalid credentials", 
                    info: "Login failed with the given user and password combination."
                });
            }
        });
    }
    else {
        res.send('Login Page\n');
    }
};

auth.signup = async (req, res) => {
    
};

auth.createToken = (user) => {
    var payload = {
        sub: user.email,
        iat: moment().unix(),
        exp: moment().add(15, "minutes").unix(),
        mod: user.role == "admin" ? 1 : 0
    };

    return "Bearer " + jwt.encode(payload, TOKEN_SECRET);
};

// Test function
auth.private = async (req, res) => {
    response = await auth.checkAuthorization(req.headers.authorization, {mod: 0});

    res.send(response);
};

auth.checkAuthorization = async (authorization, condition, callback) => {
    console.log("Validating request token...");

    if(authorization === undefined) {
        return callback(FORBIDDEN);
    }


    const token = authorization.split(" ")[1];

    console.log("Token: " + token);
    
    try {
        var payload = jwt.decode(token, TOKEN_SECRET);

        console.dir(payload);
        
        if(condition.mod !== undefined) {
            console.log("condition.mod: " + condition.mod);
            if(condition.mod > payload.mod) {
                callback(FORBIDDEN);
            }
        }
        if(condition.sub !== undefined) {
            console.log("condition.sub: " + condition.sub);
            if(condition.sub != payload.sub) {
                callback(FORBIDDEN);
            }
        }
        
        callback();

    } catch(error) {
        console.log("Error: " + error.message);
        switch(error.message) {
            case "Token expired":
                callback(EXPIRED);
                break;
            case "Signature verification failed":
            case "No token supplied":
                callback(FORBIDDEN);
                break;
        }
    }
};

module.exports = auth;