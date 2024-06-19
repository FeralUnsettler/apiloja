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