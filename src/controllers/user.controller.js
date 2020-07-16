const dbQueries = require('../helpers/database-queries');
const userCtrl = {};

userCtrl.getUsers = async (req,res) => {
    res.send("Hello world!");
}

userCtrl.createUser = async (req,res) => {
    const {email, password, name, role} = req.body;
    var response = dbQueries.executeProcedure('userAddOrEdit',[email,password,name,role])
    console.log(response);
}

module.exports = userCtrl;