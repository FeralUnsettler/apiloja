const db = require('../config/db');

const Cliente = {};

Cliente.create = (cliente, callback) => {
    const query = "INSERT INTO clientes SET ?";
    db.query(query, cliente, callback);
};

Cliente.findByEmail = (email, callback) => {
    const query = "SELECT * FROM clientes WHERE email = ?";
    db.query(query, [email], callback);
};

Cliente.findById = (id, callback) => {
    const query = "SELECT * FROM clientes WHERE id = ?";
    db.query(query, [id], callback);
};

module.exports = Cliente;