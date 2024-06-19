const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);

module.exports = router;
