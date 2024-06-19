const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middlewares/authenticate');

router.get('/produtos', authenticateAdmin, adminController.getProdutos);
router.post('/produtos', authenticateAdmin, adminController.createProduto);
router.put('/produtos/:id', authenticateAdmin, adminController.updateProduto);
router.delete('/produtos/:id', authenticateAdmin, adminController.deleteProduto);

router.get('/pedidos', authenticateAdmin, adminController.getPedidos);
router.put('/pedidos/:id', authenticateAdmin, adminController.updatePedido);

module.exports = router;
