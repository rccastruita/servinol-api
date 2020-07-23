const purchaseController = require('../controllers/purchase.controller');

const express = require('express');
const router = express.Router();

router.get('/:id', purchaseController.get);
router.post('/', purchaseController.post);


module.exports = router;