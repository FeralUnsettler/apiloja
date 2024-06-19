const Produto = require('../models/produto');

exports.getAll = (req, res) => {
    Produto.getAll((error, results) => {
        if (error) return res.status(500).send({ message: 'Error fetching products' });
        res.status(200).send(results);
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    Produto.getById(id, (error, result) => {
        if (error) return res.status(500).send({ message: 'Error fetching product' });
        res.status(200).send(result);
    });
};
