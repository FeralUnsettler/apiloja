# Para rodar o backend e o frontend localmente a partir do VSCode, siga estas etapas:

### Pré-requisitos

1. **Instalar Node.js e npm:** Certifique-se de que você tenha o Node.js e o npm instalados no seu sistema. Você pode baixá-los de [nodejs.org](https://nodejs.org/).

2. **Instalar MySQL:** Certifique-se de que o MySQL está instalado e em execução no seu sistema. Você pode baixar o MySQL de [mysql.com](https://www.mysql.com/).

### Estrutura do Projeto

Vamos assumir a seguinte estrutura de diretórios:

```
online-store/
|-- backend/
|   |-- src/
|   |-- node_modules/
|   |-- package.json
|   |-- .env
|-- frontend/
|   |-- src/
|   |-- node_modules/
|   |-- package.json
```

### Configurar e Rodar o Backend

1. **Navegar até o Diretório do Backend:**

   Abra o terminal integrado no VSCode e navegue até o diretório do backend:

   ```bash
   cd online-store/backend
   ```

2. **Instalar Dependências do Backend:**

   Instale as dependências do backend:

   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente:**

   Crie um arquivo `.env` no diretório do backend com as configurações do banco de dados e outras variáveis de ambiente:

   **backend/.env:**

   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASS=your_mysql_password
   DB_NAME=online_store
   JWT_SECRET=your_secret_key
   PORT=3001
   ```

4. **Rodar o Servidor Backend:**

   Inicie o servidor do backend:

   ```bash
   npm start
   ```

### Configurar e Rodar o Frontend

1. **Abrir um Novo Terminal no VSCode:**

   Abra um novo terminal integrado no VSCode para rodar o frontend.

2. **Navegar até o Diretório do Frontend:**

   Navegue até o diretório do frontend:

   ```bash
   cd online-store/frontend
   ```

3. **Instalar Dependências do Frontend:**

   Instale as dependências do frontend:

   ```bash
   npm install
   ```

4. **Rodar o Servidor Frontend:**

   Inicie o servidor de desenvolvimento do frontend:

   ```bash
   npm start
   ```

### Configuração do VSCode para Execução Simultânea

Para rodar o backend e o frontend simultaneamente, você pode configurar tarefas no VSCode.

1. **Configurar Tasks no VSCode:**

   Crie ou edite o arquivo `tasks.json` dentro do diretório `.vscode` no seu projeto:

   **.vscode/tasks.json:**

   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "label": "Run Backend",
         "type": "shell",
         "command": "npm start",
         "group": {
           "kind": "build",
           "isDefault": true
         },
         "options": {
           "cwd": "${workspaceFolder}/online-store-api"
         },
         "problemMatcher": []
       },
       {
         "label": "Run Frontend",
         "type": "shell",
         "command": "npm start",
         "group": {
           "kind": "build",
           "isDefault": true
         },
         "options": {
           "cwd": "${workspaceFolder}/online-store-frontend"
         },
         "problemMatcher": []
       }
     ]
   }
   ```

2. **Rodar as Tasks no VSCode:**

   Abra a paleta de comandos no VSCode (Ctrl+Shift+P ou Cmd+Shift+P) e digite `Run Task`. Selecione `Run Backend` para iniciar o servidor backend e `Run Frontend` para iniciar o servidor frontend.

### Acessar a Aplicação

- **Backend:** O backend estará rodando em `http://localhost:3001` (ou na porta configurada no seu arquivo `.env`).
- **Frontend:** O frontend estará rodando em `http://localhost:3000`.

### Conclusão

Com estas etapas, você pode configurar e rodar tanto o backend quanto o frontend localmente usando o VSCode. As tasks configuradas no VSCode permitem que você rode ambos simultaneamente de maneira eficiente.