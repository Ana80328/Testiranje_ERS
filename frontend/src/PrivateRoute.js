// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;
