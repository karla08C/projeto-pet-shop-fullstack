// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  // Se estiver carregando, não renderize nada ainda
  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de spinner
  }

  // Agora, a verificação é mais confiável
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;