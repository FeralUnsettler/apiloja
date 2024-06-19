const Produto = require('../models/produto');
const Pedido = require('../models/pedido');

exports.getProdutos = (req, res) => {
    Produto.getAll((error, results) => {
        if (error) return res.status(500).send({ message: 'Error fetching products' });
        res.status(200).send(results);
    });
};

exports.createProduto = (req, res) => {
    const newProduto = req.body;
    Produto.create(newProduto, (error, result) => {
        if (error) return res.status(500).send({ message: 'Error creating product' });
        res.status(201).send({ message: 'Product created successfully' });
    });
};

exports.updateProduto = (req, res) => {
    const { id } = req.params;
    const updatedProduto = req.body;
    Produto.update(id, updatedProduto, (error, result) => {
        if (error) return res.status(500).send({ message: 'Error updating product' });
        res.status(200).send({ message: 'Product updated successfully' });
    });
};

exports.deleteProduto = (req, res) => {
    const { id } = req.params;
    Produto.delete(id, (error, result) => {
        if (error) return res.status(500).send({ message: 'Error deleting product' });
        res.status(200).send({ message: 'Product deleted successfully' });
    });
};

exports.getPedidos = (req, res) => {
    Pedido.getAll((error, results) => {
        if (error) return res.status(500).send({ message: 'Error fetching orders' });
        res.status(200).send(results);
    });
};

exports.updatePedido = (req, res) => {
    const { id } = req.params;
    const updatedPedido = req.body;
    Pedido.update(id, updatedPedido, (error, result) => {
        if (error) return res.status(500).send({ message: 'Error updating order' });
        res.status(200).send({ message: 'Order updated successfully' });
    });
};
