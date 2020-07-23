const genreModel = require('../models/genre.model');

const genreController = {};

genreController.getAll = async (req, res) => {
    console.log("GET request at /genres");

    try {
        genres = await genreModel.getAll();
        res.status(200).send(genres);
    } catch(error) {
        console.error(error);
        res.status(500).send(error);
    }
};

genreController.get = async (req, res) => {
    console.log("GET request at /genres/" + req.params.id);

    try {
        var genre = await genreModel.select(req.params.id);
        res.status(200).send(genre);
    }
    catch(error) {
        if(!error) {
            console.log("Genre not found");
            res.status(404).send("Not found");
        }
        else {
            console.error(error);
            res.status(500).send("Internal error");
        }
    }
}

genreController.post = async (req, res) => {
    console.log("POST request at /genres")
    console.log("req.body: ");
    console.dir(req.body);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        mod: 1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied");

        if(isAuthorized == 'Token expired') {
            return res.status(401).send('Token expired');
        }
        return res.status(403).send("Forbidden");
    }
    

    var genre = req.body;

    if(!genre.name) {
        genre = {name: req.body};
    }

    try {
        var createdGenre = await genreModel.insert(genre);
        console.log("Request successful");
        console.dir(createdGenre);
        
        return res.status(201).send(createdGenre);
    } catch(error) {
        console.error(error);
        return res.status(500).send("Internal error");
    }    
};

genreController.put = async (req, res) => {
    console.log("PUT request at /genres/" + req.params.id);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        mod:1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied");
        
        if(isAuthorized == 'Token expired') {
            return res.status(401).send('Token expired');
        }

        return res.status(403).send("Forbidden");
    }

    try {
        await genreModel.update(req.params.id, req.body);
        console.log("Request successful");
        return res.status(204).send("");
    } catch(error) {
        console.error(error);
        if(error.code == "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).send("Tried to update id");
        }
        return res.status(500).send("Internal error");
    }
};

genreController.delete = async (req, res) => {
    console.log("DELETE request at /genres/" + req.params.id);

    var isAuthorized = await auth.checkAuthorization(req.headers.authorization, {
        mod: 1,
        minConditions: 1
    });

    if(isAuthorized !== true) {
        console.log("Access denied: " + isAuthorized);
        console.dir(isAuthorized);

        if(isAuthorized == "Token expired") {
            return res.status(401).send("Token expired");
        }

        return res.status(403).send("Forbidden");
    }

    try {
        var genre = await genreModel.select(req.params.id);

        await genreModel.delete(req.params.id);
        console.log("Deleted");
        return res.status(204).send("");

    } catch(modelError) {
        if(!modelError) {
            console.log("Genre not found");
            return res.status(404).send("Not found");
        }
        else {
            console.error(modelError);
            return res.status(500).send("Internal error");
        }
    }
};


module.exports = genreController;