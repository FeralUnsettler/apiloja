const db = require('../config/db');

const Pedido = {};

Pedido.getAll = (callback) => {
    const query = "SELECT * FROM pedidos";
    db.query(query, callback);
};

Pedido.getById = (id, callback) => {
    const query = "SELECT * FROM pedidos WHERE id = ?";
    db.query(query, [id], callback);
};

Pedido.create = (pedido, callback) => {
    const query = "INSERT INTO pedidos SET ?";
    db.query(query, pedido, callback);
};

Pedido.update = (id, pedido, callback) => {
    const query = "UPDATE pedidos SET ? WHERE id = ?";
    db.query(query, [pedido, id], callback);
};

module.exports = Pedido;
