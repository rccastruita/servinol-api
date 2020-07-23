const cartController = require('../controllers/cart.controller');

const express = require('express');
const router = express.Router();

router.get("/:userId", cartController.get);
router.get("/", cartController.getAll);
router.post("/", cartController.post);

module.exports = router;