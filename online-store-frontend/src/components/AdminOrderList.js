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