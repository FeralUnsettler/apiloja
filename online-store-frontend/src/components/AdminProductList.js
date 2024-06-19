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