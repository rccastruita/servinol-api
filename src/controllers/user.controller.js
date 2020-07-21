const userModel = require('../models/user.model');

const userController = {};

userController.get = async (req, res) => {
    console.log("Requesting user by email: " + req.params.email);
    
    var userGetResponse = await userModel.select(req.params.email);
    res.status(userGetResponse.code).json(userGetResponse.body);
}

userController.getAll = async (req, res) => {
    console.log("Requesting all users...");

    var userGetAllResponse = await userModel.getAll();
    res.status(userGetAllResponse.code).json(userGetAllResponse.body);
}

userController.post = async (req, res) => {
    console.log("Requesting to create user...");

    var user = await auth.prepareUser(req.body);
    
    userPostResponse = await userModel.insert(user);
    res.status(userPostResponse.code).json(userPostResponse.body);    
}

userController.put = async (req, res) => {
    console.log("Requesting to update user: " + req.params.email);
    
    userPutResponse = await userModel.update(req.body);
    res.status(userPutResponse.code).json(userPutResponse.body);
}

userController.delete = async (req, res) => {
    console.log("Requesting to delete user by email: " + req.params.email);

    userDeleteResponse = await userModel.delete(req.params.email);
    res.status(userDeleteResponse.code).json(userDeleteResponse.body);
}

module.exports = userController;