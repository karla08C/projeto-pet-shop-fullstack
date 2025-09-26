// src/hooks/usePermissions.js (VERSÃO FINAL)

import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
    const { usuario, loading } = useAuth();
    
    // Normaliza o tipo para garantir a checagem, usando toUpperCase()
    const userType = usuario?.tipo?.toUpperCase(); 
    
    // 🛑 A permissão é concedida se o tipo for VENDEDOR ou ADMIN (em maiúsculas)
    const isVendedor = userType && (userType === 'VENDEDOR' || userType === 'ADMIN');
    
    return {
        isVendedor,
        authLoading: loading,
        usuarioId: usuario?.id
    };
};