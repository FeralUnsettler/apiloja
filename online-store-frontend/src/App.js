import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import AdminProductList from './components/AdminProductList';
import AdminOrderList from './components/AdminOrderList';
import './App.css';
import logo from './logo.svg';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>Edit <code>src/App.js</code> and save to reload.</p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/products" component={ProductList} />
                    <Route path="/orders" component={OrderList} />
                    <Route path="/admin/products" component={AdminProductList} />
                    <Route path="/admin/orders" component={AdminOrderList} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
