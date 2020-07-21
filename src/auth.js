const bcrypt = require('bcrypt');
const userModel = require('./models/user.model');
const jwt = require('jwt-simple');
const moment = require('moment');

const TOKEN_SECRET = "jvvL7rdRr1xBjETS79Wh";

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
        exp: moment().add(15, "minutes").unix()
    };

    return jwt.encode(payload, TOKEN_SECRET);
};

// Test function
auth.private = async (req, res) => {
    console.log("Requesting access to private site");

    if(!req.headers.authorization) {
        return res.status(403).json({
            message: "Forbidden", 
            info: "Access denied to this site"
        });
    }
    var payload = jwt.decode(req.headers.authorization, TOKEN_SECRET);
    console.dir(payload);

    console.log("Now: " + moment().unix());

    if(payload.exp <= moment().unix()) {
        return res.status(401).json({
            message: "Session expired", 
            info: "Please login again"
        });
    }

    res.status(200).send("Access granted");
};

module.exports = auth;