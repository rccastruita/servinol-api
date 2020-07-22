const bcrypt = require('bcrypt');
const userModel = require('./models/user.model');
const jwt = require('jwt-simple');
const moment = require('moment');
auth = {};


const TOKEN_SECRET = "jvvL7rdRr1xBjETS79Wh";

auth.prepareUser = async (user) => {
    return new Promise((resolve) => {
        bcrypt.hash(user.password, 10, (err, hash) => {
            user.password = hash;

            resolve(user);
        });
    });
};

auth.hashPassword = async (password) => {
    return new Promise((resolve) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if(err) {
                console.error(err);
            }
            resolve(hash);
        })
    })
}

auth.createToken = (user) => {
    console.log("Generating token for: ")
    var payload = {
        sub: user.id,
        iat: moment().unix(),
        exp: moment().add(15, "minutes").unix(),
        mod: user.role == "admin" ? 1 : 0
    };
    console.dir(payload);
    
    var header = "Bearer " + jwt.encode(payload, TOKEN_SECRET);
    console.log("Token generated: " + header);
    return header;
};

auth.checkAuthorization = async (authorization, condition) => {
    console.log("Validating request authorization...");
    console.dir(condition);

    if(authorization === undefined) {
        console.log("Rejected: Authorization header missing");
        return "No header";
    }

    console.log("Authorization header: " + authorization);
    const header_parts = authorization.split(" ");
    if(header_parts[0] !== "Bearer") {
        console.log("Rejected: Wrong authorization header");
        return "Wrong header";
    }

    const token = header_parts[1];
    
    try {
        var payload = jwt.decode(token, TOKEN_SECRET);
        console.dir(payload);

        var conditionsPassed = 0;
        
        if(condition.mod !== undefined) {
            if(payload.mod >= condition.mod) {
                conditionsPassed++;
            }
        }
        if(condition.sub !== undefined) {
            if(payload.sub == condition.sub) {
                conditionsPassed++;
            }
        }
        
        if(conditionsPassed < condition.minConditions) {
            console.log("Rejected: Conditions failed");
            return "Conditions failed";
        }

        console.log("Token accepted");
        return true;

    } catch(error) {
        console.log("Rejected: " + error.message);
        return error.message;
    }
};

module.exports = auth;