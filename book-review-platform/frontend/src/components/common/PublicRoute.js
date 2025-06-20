import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Default to dashboard for authenticated users, or the intended page if specified
  const from = location.state?.from?.pathname || '/dashboard';

  // If already authenticated, redirect to the intended page or dashboard
  if (!loading && isAuthenticated) {
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute;
