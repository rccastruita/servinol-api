const express = require('express');
const router = express.Router();
const img = require('../img');

router.get('/:id', img.get);

module.exports = router;