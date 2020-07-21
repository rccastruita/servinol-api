const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.get('/:email', userController.get);
router.post('/', userController.post);
router.put('/:email', userController.put);
router.delete('/:email', userController.delete);

module.exports = router;