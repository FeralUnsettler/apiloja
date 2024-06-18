

## API RESTFull

### Plano Detalhado para a Construção da API

1. **Configuração do Ambiente:**
   - Inicializar um novo projeto Node.js.
   - Instalar as dependências necessárias (`express`, `mysql`, `body-parser`, `jsonwebtoken`, `bcrypt`, `cors`).

2. **Configuração do Servidor Express:**
   - Configurar o servidor Express.
   - Configurar middleware para parsear JSON e gerenciar CORS.

3. **Configuração da Conexão com o Banco de Dados:**
   - Criar uma conexão MySQL reutilizável.
   - Configurar variáveis de ambiente para credenciais do banco de dados.

4. **Modelos de Dados:**
   - Definir modelos para `Clientes`, `Produtos`, `Pedidos`, `Cidades`, `Categorias`.

5. **Endpoints da API:**
   - **Clientes:**
     - Registro de clientes (`POST /clientes`).
     - Consulta de produtos disponíveis (`GET /produtos`).
     - Realização de pedidos (`POST /pedidos`).
     - Consulta de pedidos realizados (`GET /pedidos`).

   - **Administradores:**
     - CRUD de produtos (`GET /admin/produtos`, `POST /admin/produtos`, `PUT /admin/produtos/:id`, `DELETE /admin/produtos/:id`).
     - Consulta e atualização de pedidos (`GET /admin/pedidos`, `PUT /admin/pedidos/:id`).

6. **Autenticação e Autorização:**
   - Implementar autenticação JWT para diferenciar clientes e administradores.
   - Proteger endpoints administrativos.

7. **Tratamento de Erros:**
   - Middleware para tratamento de erros e respostas apropriadas.

8. **Frontend:**
   - Desenvolver uma interface frontend usando React.
   - Configurar rotas e componentes para cadastro de clientes, consulta de produtos, realização e listagem de pedidos.
   - Interface administrativa para gerenciamento de produtos e pedidos.

### Implementação

**Configuração do Ambiente e Servidor Express:**

```bash
mkdir online_store_api
cd online_store_api
npm init -y
npm install express mysql body-parser jsonwebtoken bcrypt cors
```

**Estrutura do Projeto:**

```
online_store_api/
|-- node_modules/
|-- src/
|   |-- controllers/
|   |   |-- clienteController.js
|   |   |-- produtoController.js
|   |   |-- pedidoController.js
|   |   |-- adminController.js
|   |-- models/
|   |   |-- cliente.js
|   |   |-- produto.js
|   |   |-- pedido.js
|   |-- routes/
|   |   |-- clienteRoutes.js
|   |   |-- produtoRoutes.js
|   |   |-- pedidoRoutes.js
|   |   |-- adminRoutes.js
|   |-- config/
|   |   |-- db.js
|-- .env
|-- app.js
|-- package.json
```

**app.js:**

```javascript
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
```

**src/config/db.js:**

```javascript
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(error => {
    if (error) throw error;
    console.log('Database connected!');
});

module.exports = connection;
```

**src/models/cliente.js:**

```javascript
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
```

**src/models/produto.js:**

```javascript
const db = require('../config/db');

const Produto = {};

Produto.getAll = (callback) => {
    const query = "SELECT * FROM produtos";
    db.query(query, callback);
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
```

**src/controllers/clienteController.js:**

```javascript
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
```

**src/routes/clienteRoutes.js:**

```javascript
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/register', clienteController.register);
router.post('/login', clienteController.login);

module.exports = router;
```

**Implementação Completa:**

Este exemplo mostra como configurar a base da API, incluindo o registro e login de clientes, bem como a estrutura básica para modelos e controladores. A partir daqui, você pode expandir os endpoints conforme necessário para incluir todas as funcionalidades especificadas (gerenciamento de produtos, pedidos, autenticação de administradores, etc.).

### Sugestões para Melhorias Futuras

**a.** Implementar os endpoints para gerenciar produtos e pedidos para administradores.
**b.** Desenvolver o frontend utilizando React com uma UI/UX elegante, integrando com a API.

## Implementação dos Endpoints para Administradores

#### Gerenciamento de Produtos e Pedidos

Vamos adicionar os endpoints para que os administradores possam gerenciar produtos e pedidos.

**src/controllers/adminController.js:**

```javascript
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
```

**src/models/pedido.js:**

```javascript
const db = require('../config/db');

const Pedido = {};

Pedido.getAll = (callback) => {
    const query = "SELECT * FROM pedidos";
    db.query(query, callback);
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
```

**src/routes/adminRoutes.js:**

```javascript
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
```

**src/middlewares/authenticate.js:**

```javascript
const jwt = require('jsonwebtoken');

exports.authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).send({ message: 'Access denied. Insufficient permissions.' });
        }
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ message: 'Invalid token.' });
    }
};
```

### Desenvolvimento do Frontend com React

Vamos criar um projeto React para a interface de usuário. A interface incluirá formulários de registro e login, uma página de produtos, uma página para pedidos e uma área administrativa para gerenciar produtos e pedidos.

**Configuração do Ambiente React:**

```bash
npx create-react-app online-store-frontend
cd online-store-frontend
npm install axios react-router-dom
```

**Estrutura do Projeto:**

```
online-store-frontend/
|-- public/
|-- src/
|   |-- components/
|   |   |-- Register.js
|   |   |-- Login.js
|   |   |-- ProductList.js
|   |   |-- OrderList.js
|   |   |-- AdminProductList.js
|   |   |-- AdminOrderList.js
|   |-- services/
|   |   |-- api.js
|   |-- App.js
|   |-- index.js
|-- package.json
```

**src/services/api.js:**

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

export default api;
```

**src/components/Register.js:**

```javascript
import React, { useState } from 'react';
import api from '../services/api';

const Register = () => {
    const [form, setForm] = useState({ nome: '', email: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/clientes/register', form);
            alert('Registration successful');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="nome" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
```

**src/components/Login.js:**

```javascript
import React, { useState } from 'react';
import api from '../services/api';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/clientes/login', form);
            localStorage.setItem('token', response.data.token);
            alert('Login successful');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
```

**src/components/ProductList.js:**

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await api.get('/produtos');
            setProducts(response.data);
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Available Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.nome} - ${product.preco}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
```

**src/components/OrderList.js:**

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/pedidos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Your Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        {order.horario} - {order.endereco}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
```

**src/components/AdminProductList.js:**

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminProductList = () => {
    const [products,

 setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ nome: '', preco: '', quantidade: '', categoria_id: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/admin/produtos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data);
        };

        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/admin/produtos', newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Product added successfully');
        } catch (error) {
            alert('Failed to add product');
        }
    };

    return (
        <div>
            <h1>Admin - Manage Products</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nome" placeholder="Product Name" onChange={handleChange} required />
                <input type="number" name="preco" placeholder="Price" onChange={handleChange} required />
                <input type="number" name="quantidade" placeholder="Quantity" onChange={handleChange} required />
                <input type="number" name="categoria_id" placeholder="Category ID" onChange={handleChange} required />
                <button type="submit">Add Product</button>
            </form>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.nome} - ${product.preco}
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const handleDelete = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await api.delete(`/admin/produtos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert('Product deleted successfully');
    } catch (error) {
        alert('Failed to delete product');
    }
};

export default AdminProductList;
```

**src/components/AdminOrderList.js:**

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/admin/pedidos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Admin - Manage Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        {order.horario} - {order.endereco}
                        <button onClick={() => handleUpdate(order.id)}>Update</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const handleUpdate = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await api.put(`/admin/pedidos/${id}`, { status: 'updated' }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert('Order updated successfully');
    } catch (error) {
        alert('Failed to update order');
    }
};

export default AdminOrderList;
```

**src/App.js:**

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import AdminProductList from './components/AdminProductList';
import AdminOrderList from './components/AdminOrderList';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/products" component={ProductList} />
                <Route path="/orders" component={OrderList} />
                <Route path="/admin/products" component={AdminProductList} />
                <Route path="/admin/orders" component={AdminOrderList} />
            </Switch>
        </Router>
    );
}

export default App;
```

### Conclusão

A API e o frontend foram configurados para atender às funcionalidades especificadas. O backend foi implementado com Node.js e Express, enquanto o frontend foi desenvolvido com React. Agora você pode testar a aplicação completa, registrando clientes, fazendo login, visualizando produtos, fazendo pedidos, e utilizando a interface administrativa para gerenciar produtos e pedidos.


## DataBase Creation


### script Python tem a funcionalidade de criar um banco de dados MySQL chamado `online_store`, juntamente com várias tabelas necessárias para uma aplicação de loja online. 

```python
import os
import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASS', 'password')
        )
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"Error: {e}")
        return None

def create_database(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("DROP DATABASE IF EXISTS online_store")
        cursor.execute("CREATE DATABASE online_store")
        cursor.execute("USE online_store")
    except Error as e:
        print(f"Error: {e}")

def create_tables(conn):
    tables = {
        "cidades": """
            CREATE TABLE cidades (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(50) NOT NULL
            )
        """,
        "categorias": """
            CREATE TABLE categorias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL
            )
        """,
        "clientes": """
            CREATE TABLE clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                altura DOUBLE,
                nascim_tb DATE,
                cidade_id INT,
                FOREIGN KEY (cidade_id) REFERENCES cidades(id)
            )
        """,
        "produtos": """
            CREATE TABLE produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                preco DOUBLE NOT NULL,
                quantidade DOUBLE NOT NULL,
                categoria_id INT,
                FOREIGN KEY (categoria_id) REFERENCES categorias(id)
            )
        """,
        "pedidos": """
            CREATE TABLE pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                horario DATETIME NOT NULL,
                endereco VARCHAR(200) NOT NULL,
                cliente_id INT,
                FOREIGN KEY (cliente_id) REFERENCES clientes(id)
            )
        """,
        "pedidos_produtos": """
            CREATE TABLE pedidos_produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pedido_id INT,
                produto_id INT,
                preco DOUBLE NOT NULL,
                quantidade DOUBLE NOT NULL,
                FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
                FOREIGN KEY (produto_id) REFERENCES produtos(id)
            )
        """
    }

    cursor = conn.cursor()
    for table_name, table_sql in tables.items():
        try:
            cursor.execute(table_sql)
        except Error as e:
            print(f"Error creating table {table_name}: {e}")
    conn.commit()
    cursor.close()

if __name__ == "__main__":
    conn = create_connection()
    if conn:
        create_database(conn)
        create_tables(conn)
        conn.close()
```

**a.** Executar o script melhorado para verificar se ele cria o banco de dados e tabelas corretamente.
**b.** Adicionar testes unitários para garantir que a conexão com o banco de dados e a criação das tabelas funcionem como esperado.


### Sugestões para Melhorias Futuras

**a.** Adicionar mais validações e tratamento de erros no frontend para melhorar a experiência do usuário.
**b.** Implementar autenticação e autorização no frontend para proteger as rotas administrativas.

## Implementação de Autenticação e Autorização no Frontend

Para proteger as rotas administrativas no frontend, vamos implementar a autenticação e autorização utilizando JWT. Primeiro, vamos modificar o backend para incluir o campo `role` no token JWT e criar um middleware para verificar o papel do usuário.

### Backend

**src/controllers/clienteController.js (Atualização):**

```javascript
exports.register = (req, res) => {
    const { nome, email, password, role } = req.body; // Adiciona o campo role

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({ message: 'Error hashing password' });
        }

        const newCliente = {
            nome,
            email,
            password: hash,
            role // Adiciona o campo role ao novo cliente
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

            const token = jwt.sign({ id: cliente.id, role: cliente.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Inclui o role no token
            res.status(200).send({ token });
        });
    });
};
```

**src/models/cliente.js (Atualização):**

```javascript
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
```

### Frontend

**src/services/api.js:**

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
```

**src/components/Login.js:**

```javascript
import React, { useState } from 'react';
import api from '../services/api';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const history = useHistory();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/clientes/login', form);
            localStorage.setItem('token', response.data.token);
            alert('Login successful');
            history.push('/products');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
```

**src/components/PrivateRoute.js:**

```javascript
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                const token = localStorage.getItem('token');
                if (!token) {
                    return <Redirect to="/login" />;
                }

                const user = JSON.parse(atob(token.split('.')[1]));
                if (roles && roles.indexOf(user.role) === -1) {
                    return <Redirect to="/login" />;
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
```

**src/components/AdminProductList.js (Ajuste para autenticação):**

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ nome: '', preco: '', quantidade: '', categoria_id: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await api.get('/admin/produtos');
            setProducts(response.data);
        };

        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/produtos', newProduct);
            alert('Product added successfully');
        } catch (error) {
            alert('Failed to add product');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/produtos/${id}`);
            alert('Product deleted successfully');
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    return (
        <div>
            <h1>Admin - Manage Products</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nome" placeholder="Product Name" onChange={handleChange} required />
                <input type="number" name="preco" placeholder="Price" onChange={handleChange} required />
                <input type="number" name="quantidade" placeholder="Quantity" onChange={handleChange} required />
                <input type="number" name="categoria_id" placeholder="Category ID" onChange={handleChange} required />
                <button type="submit">Add Product</button>
            </form>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.nome} - ${product.preco}
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProductList;
```

**src/components/AdminOrderList.js (Ajuste para autenticação):**

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await api.get('/admin/pedidos');
            setOrders(response.data);
        };

        fetchOrders();
    }, []);

    const handleUpdate = async (id) => {
        try {
            await api.put(`/admin/pedidos/${id}`, { status: 'updated' });
            alert('Order updated successfully');
        } catch (error) {
            alert('Failed to update order');
        }
    };

    return (
        <div>
            <h1>Admin - Manage Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        {order.horario} - {order.endereco}
                        <button onClick={() => handleUpdate(order.id)}>Update</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminOrderList;
```

**src/App.js:**

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import AdminProductList from './components/AdminProductList';
import AdminOrderList from './components/AdminOrderList';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <PrivateRoute path="/products" component={ProductList} />
                <PrivateRoute path="/orders" component={OrderList} roles={['client']} />
                <PrivateRoute path="/admin/products" component={AdminProductList} roles={['admin']} />
                <PrivateRoute path="/admin/orders" component={AdminOrderList} roles={['admin']} />
            </Switch>
        </Router>
    );
}

export default App;
```

### Conclusão

Com estas alterações, a aplicação frontend agora possui
