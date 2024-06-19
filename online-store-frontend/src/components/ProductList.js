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