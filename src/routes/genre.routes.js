const express = require('express');
const genreController = require('../controllers/genre.controller');
const router = express.Router();

router.get('/', genreController.getAll);
router.get('/:id', genreController.get);
router.post('/', genreController.post);
router.put('/:id', genreController.put);
router.delete('/:id', genreController.delete);

module.exports = router;