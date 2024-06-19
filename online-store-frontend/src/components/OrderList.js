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