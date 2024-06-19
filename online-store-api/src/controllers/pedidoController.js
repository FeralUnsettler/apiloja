const Pedido = require('../models/pedido');

exports.getAll = (req, res) => {
    Pedido.getAll((error, results) => {
        if (error) return res.status(500).send({ message: 'Error fetching orders' });
        res.status(200).send(results);
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    Pedido.getById(id, (error, result) => {
        if (error) return res.status(500).send({ message: 'Error fetching order' });
        res.status(200).send(result);
    });
};
