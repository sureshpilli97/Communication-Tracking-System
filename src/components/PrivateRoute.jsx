import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to={`/${user.role}`} replace />;
    }
    return <Outlet />;
};

export default PrivateRoute;
