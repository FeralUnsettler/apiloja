const Cliente = require('../models/cliente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { nome, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({ message: 'Error hashing password' });
        }

        const newCliente = {
            nome,
            email,
            password: hash
        };

        Cliente.create(newCliente, (error, result) => {
            if (error) {
                return res.status(500).send({ message: 'Error registering client' });
            }
            res.status(201).send({ message: 'Client registered successfully' });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    Cliente.findByEmail(email, (error, results) => {
        if (error || results.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const cliente = results[0];

        bcrypt.compare(password, cliente.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: cliente.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).send({ token });
        });
    });
};