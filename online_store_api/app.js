const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./src/routes/clienteRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
