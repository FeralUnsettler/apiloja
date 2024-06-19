import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Função para obter o token JWT do armazenamento local
const getToken = () => {
    return localStorage.getItem('token');
};

// Função para decodificar o token JWT
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            const token = getToken();
            if (!token) {
                // Se não houver token, redirecione para a página de login
                return <Redirect to="/login" />;
            }

            const user = decodeToken(token);
            if (roles && roles.indexOf(user.role) === -1) {
                // Se o usuário não tiver o papel necessário, redirecione para a página de login
                return <Redirect to="/login" />;
            }

            // Renderize o componente solicitado se todas as verificações passarem
            return <Component {...props} />;
        }}
    />
);

export default PrivateRoute;
