const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);
router.get('/:id', userController.get);
router.post('/', userController.post);
router.put('/:id', userController.put);
router.delete('/:id', userController.delete);
router.post('/login', userController.login);

module.exports = router;