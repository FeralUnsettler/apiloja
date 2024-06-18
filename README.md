
# Online Store API

Este projeto implementa uma API RESTful para uma loja online, desenvolvida com Node.js e Express, com um frontend React para clientes e administradores. A API permite que os clientes se registrem, consultem produtos disponíveis, realizem e listem seus pedidos. Os administradores têm acesso a recursos adicionais para gerenciamento de produtos e pedidos.

## Índice

- [Online Store API](#online-store-api)
  - [Índice](#índice)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Instalação](#instalação)
  - [Configuração](#configuração)
  - [Endpoints da API](#endpoints-da-api)
    - [Clientes](#clientes)
    - [Produtos](#produtos)
    - [Pedidos](#pedidos)
    - [Administradores](#administradores)
  - [Frontend](#frontend)
    - [Instalação do Frontend](#instalação-do-frontend)
    - [Componentes Principais](#componentes-principais)
  - [Contribuição](#contribuição)
  - [Licença](#licença)

## Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- React
- Axios
- JWT (Json Web Token)
- Bcrypt
- Dotenv
- Cors

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/online-store-api.git
cd online-store-api
```

2. Instale as dependências do backend:

```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto com as seguintes informações:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=online_store
JWT_SECRET=sua_chave_secreta
PORT=3000
```

4. Inicialize o servidor:

```bash
npm start
```

## Configuração

Certifique-se de que você tenha um servidor MySQL rodando e as credenciais corretas no arquivo `.env`.

Crie o banco de dados e as tabelas necessárias utilizando o script fornecido na pasta `scripts`:

```sql
-- scripts/init_db.sql

CREATE DATABASE IF NOT EXISTS online_store;

USE online_store;

CREATE TABLE cidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    altura DOUBLE,
    nascim_tb DATE,
    cidade_id INT,
    FOREIGN KEY (cidade_id) REFERENCES cidades(id)
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DOUBLE NOT NULL,
    quantidade DOUBLE NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    horario DATETIME NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE pedidos_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    preco DOUBLE NOT NULL,
    quantidade DOUBLE NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
```

## Endpoints da API

### Clientes

- **POST /clientes/register** - Registro de novos clientes

  ```json
  {
    "nome": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **POST /clientes/login** - Login de clientes

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

### Produtos

- **GET /produtos** - Consulta de produtos disponíveis

### Pedidos

- **POST /pedidos** - Realização de um pedido

  ```json
  {
    "horario": "2024-06-18T12:00:00",
    "endereco": "123 Main St",
    "cliente_id": 1,
    "produtos": [
      {
        "produto_id": 1,
        "quantidade": 2,
        "preco": 19.99
      }
    ]
  }
  ```

- **GET /pedidos** - Consulta de pedidos realizados

### Administradores

Os endpoints de administrador requerem autenticação JWT com a role `admin`.

- **GET /admin/produtos** - Listar todos os produtos

- **POST /admin/produtos** - Criar um novo produto

  ```json
  {
    "nome": "Produto X",
    "preco": 29.99,
    "quantidade": 100,
    "categoria_id": 1
  }
  ```

- **PUT /admin/produtos/:id** - Atualizar um produto

  ```json
  {
    "nome": "Produto X",
    "preco": 25.99,
    "quantidade": 150,
    "categoria_id": 1
  }
  ```

- **DELETE /admin/produtos/:id** - Excluir um produto

- **GET /admin/pedidos** - Listar todos os pedidos

- **PUT /admin/pedidos/:id** - Atualizar um pedido

  ```json
  {
    "status": "entregue"
  }
  ```

## Frontend

### Instalação do Frontend

1. Navegue para o diretório do frontend e instale as dependências:

```bash
cd online-store-frontend
npm install
```

2. Inicialize o frontend:

```bash
npm start
```

### Componentes Principais

- **Register.js** - Componente para registro de novos clientes
- **Login.js** - Componente para login de clientes
- **ProductList.js** - Componente para listar produtos disponíveis
- **OrderList.js** - Componente para listar pedidos do cliente
- **AdminProductList.js** - Componente para administradores gerenciarem produtos
- **AdminOrderList.js** - Componente para administradores gerenciarem pedidos

## Contribuição

1. Faça um fork do projeto
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
