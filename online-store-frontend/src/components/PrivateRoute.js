import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                const token = localStorage.getItem('token');
                if (!token) {
                    return <Redirect to="/login" />;
                }

                const user = JSON.parse(atob(token.split('.')[1]));
                if (roles && roles.indexOf(user.role) === -1) {
                    return <Redirect to="/login" />;
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;