const express = require('express');
const router = express.Router();
const auth = require('../auth');

router.post('/login', auth.login);
router.post('/signup', auth.signup);
router.get('/private', auth.private);

module.exports = router;