Vamos refatorar toda a API para funcionar com base no diagrama ER fornecido e usando MySQL. Primeiro, criaremos um script Python para configurar o banco de dados MySQL localmente. Em seguida, refatoraremos a API para utilizar Sequelize como ORM para interagir com o MySQL.

### 1. Script Python para Criação do Banco de Dados

```python
import mysql.connector

def create_database():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="password"
    )
    
    cursor = conn.cursor()
    cursor.execute("DROP DATABASE IF EXISTS online_store")
    cursor.execute("CREATE DATABASE online_store")
    cursor.execute("USE online_store")
    
    cursor.execute("""
        CREATE TABLE cidades (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(50) NOT NULL
        )
    """)
    
    cursor.execute("""
        CREATE TABLE categorias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL
        )
    """)
    
    cursor.execute("""
        CREATE TABLE clientes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            altura DOUBLE,
            nascim_tb DATE,
            cidade_id INT,
            FOREIGN KEY (cidade_id) REFERENCES cidades(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE produtos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            preco DOUBLE NOT NULL,
            quantidade DOUBLE NOT NULL,
            categoria_id INT,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE pedidos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            horario DATETIME NOT NULL,
            endereco VARCHAR(200) NOT NULL,
            cliente_id INT,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE pedidos_produtos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            pedido_id INT,
            produto_id INT,
            preco DOUBLE NOT NULL,
            quantidade DOUBLE NOT NULL,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        )
    """)
    
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_database()
```

### 2. Configuração da API usando Sequelize e MySQL

#### Instalação de Dependências

```sh
npm install express body-parser mysql2 sequelize jsonwebtoken bcryptjs
```

#### Estrutura de Diretórios

```plaintext
src/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── adminController.js
├── middlewares/
│   └── auth.js
├── models/
│   ├── index.js
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── cidade.js
│   ├── categoria.js
│   ├── pedidoProduto.js
│   └── associations.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── admin.js
├── app.js
└── server.js
```

#### Configuração do Sequelize

```javascript
// src/config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('online_store', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
```

#### Definição dos Modelos

```javascript
// src/models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    altura: {
        type: DataTypes.DOUBLE,
    },
    nascim_tb: {
        type: DataTypes.DATE,
    },
    cidade_id: {
        type: DataTypes.INTEGER,
    }
});

module.exports = User;

// src/models/product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    categoria_id: {
        type: DataTypes.INTEGER,
    }
});

module.exports = Product;

// src/models/order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    horario: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
    }
});

module.exports = Order;

// src/models/cidade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cidade = sequelize.define('Cidade', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Cidade;

// src/models/categoria.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Categoria = sequelize.define('Categoria', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Categoria;

// src/models/pedidoProduto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PedidoProduto = sequelize.define('PedidoProduto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pedido_id: {
        type: DataTypes.INTEGER,
    },
    produto_id: {
        type: DataTypes.INTEGER,
    },
    preco: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
});

module.exports = PedidoProduto;

// src/models/associations.js
const User = require('./user');
const Product = require('./product');
const Order = require('./order');
const Cidade = require('./cidade');
const Categoria = require('./categoria');
const PedidoProduto = require('./pedidoProduto');

User.belongsTo(Cidade, { foreignKey: 'cidade_id' });
Cidade.hasMany(User, { foreignKey: 'cidade_id' });

Order.belongsTo(User, { foreignKey: 'cliente_id' });
User.hasMany(Order, { foreignKey: 'cliente_id' });

Order.belongsToMany(Product, { through: PedidoProduto, foreignKey: 'pedido_id' });
Product.belongsToMany(Order, { through: PedidoProduto, foreignKey: 'produto_id' });

Product.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Categoria.hasMany(Product, { foreignKey: 'categoria_id' });

module.exports = {
    User,
    Product,
    Order,
    Cidade,
    Categoria,
    PedidoProduto
};
```

#### Controladores

```javascript
// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.json(user);
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 'secret_key');
    res.json({ token });
};

// src/controllers/productController.js
const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};

// src/controllers/orderController.js
const Order = require('../models/order');
const PedidoProduto = require('../models/pedidoProduto');

exports.createOrder = async (req, res) => {
    const { horario, endereco, cliente_id, products } = req.body;
    const order = await Order.create({ horario, endereco, cliente_id });
    for (const product of products) {
        await PedidoProduto.create({ pedido_id: order.id, produto_id: product.id, preco: product.preco, quantidade: product.quantidade });
    }
    res.status(201).json(order);
};

exports.getAllOrders = async (req, res) => {
    const orders = await Order.findAll();
    res.json(orders

);
};

// src/controllers/adminController.js
const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};
```

#### Middlewares

```javascript
// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, 'secret_key');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
```

#### Rotas

```javascript
// src/routes/auth.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;

// src/routes/products.js
const express = require('express');
const { getAllProducts } = require('../controllers/productController');
const router = express.Router();

router.get('/', getAllProducts);

module.exports = router;

// src/routes/orders.js
const express = require('express');
const { createOrder, getAllOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getAllOrders);

module.exports = router;

// src/routes/admin.js
const express = require('express');
const { getAllUsers } = require('../controllers/adminController');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

router.get('/users', authenticateToken, getAllUsers);

module.exports = router;
```

#### Arquivos de Inicialização

```javascript
// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

module.exports = app;

// src/server.js
const sequelize = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
```

### Próximos Passos

1. **a.** Executar o script Python para criar e configurar o banco de dados MySQL.
2. **b.** Configurar variáveis de ambiente para armazenar dados sensíveis como a chave secreta JWT e as credenciais do banco de dados.

Essas etapas garantem que a API está configurada corretamente e que todas as operações CRUD funcionam conforme o esperado.
