const db = require('../config/db');

const Produto = {};

Produto.getAll = (callback) => {
    const query = "SELECT * FROM produtos";
    db.query(query, callback);
};

Produto.getById = (id, callback) => {
    const query = "SELECT * FROM produtos WHERE id = ?";
    db.query(query, [id], callback);
};

Produto.create = (produto, callback) => {
    const query = "INSERT INTO produtos SET ?";
    db.query(query, produto, callback);
};

Produto.update = (id, produto, callback) => {
    const query = "UPDATE produtos SET ? WHERE id = ?";
    db.query(query, [produto, id], callback);
};

Produto.delete = (id, callback) => {
    const query = "DELETE FROM produtos WHERE id = ?";
    db.query(query, [id], callback);
};

module.exports = Produto;
