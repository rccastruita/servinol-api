const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getAll);
router.get('/:id', productController.get);
router.post('/', productController.post);
router.put('/', productController.put);
router.delete('/:id', productController.delete);

module.exports = router;