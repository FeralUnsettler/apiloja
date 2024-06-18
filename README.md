## API RESTful 


### Plano Detalhado:

1. **Configuração do Banco de Dados:**
   - Configurar um banco de dados MySQL local.
   - Criar tabelas conforme o diagrama ER fornecido.

2. **Atualização da API para usar MySQL:**
   - Modificar os modelos para se comunicar com o MySQL em vez do MongoDB.
   - Utilizar o Sequelize como ORM para interagir com o banco de dados MySQL.

3. **Script Python para Criação do Banco de Dados:**
   - Escrever um script Python para criar e popular o banco de dados localmente.

### Script Python para Criação do Banco de Dados:

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

### Atualização da API para Utilizar Sequelize com MySQL

1. **Instalação de Dependências:**
   ```sh
   npm install mysql2 sequelize
   ```

2. **Configuração do Sequelize:**

```javascript
// src/config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('online_store', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
```

3. **Definição dos Modelos:**

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
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    stock: {
        type: DataTypes.DOUBLE,
        allowNull: false
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

User.hasMany(Order, { foreignKey: 'cliente_id' });
Order.belongsTo(User, { foreignKey: 'cliente_id' });

Order.belongsToMany(Product, { through: PedidoProduto, foreignKey: 'pedido_id' });
Product.belongsToMany(Order, { through: PedidoProduto, foreignKey: 'produto_id' });

Product.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Cidade.hasMany(User, { foreignKey: 'cidade_id' });
User.belongsTo(Cidade, { foreignKey: 'cidade_id' });

module.exports = {
    User,
    Product,
    Order,
    Cidade,
    Categoria,
    PedidoProduto
};
```

4. **Sincronização dos Modelos:**

```javascript
// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});

module.exports = app;
```

5. **Inicialização do Servidor:**

```javascript
// src/server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

### Sugestões para o próximo passo:
**a.** Testar a API utilizando ferramentas como Postman ou Insomnia para garantir que todas as funcionalidades estão corretas.
**b.** Implementar testes automatizados para verificar a integridade da API e suas funcionalidades.
