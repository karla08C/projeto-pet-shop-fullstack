import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // 🛑 CORREÇÃO: Importar a instância 'api'
// import axios from 'axios'; // 🛑 REMOVIDO: Não é mais necessário

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verificarSessao = async () => {
            if (token) {
                try {
                    // 🛑 CORREÇÃO CRÍTICA: Usar a instância 'api' que injeta o token
                    const { data } = await api.get('/usuarios/perfil'); 
                    
                    setUsuario(data);
                } catch (error) {
                    console.error("Token inválido ou expirado", error);
                    
                    localStorage.removeItem('token'); 
                    setToken(null);
                }
            }
            setLoading(false);
        };
        
        verificarSessao();
    }, [token]);

    const login = ({ token, usuario }) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUsuario(usuario);
        // O interceptor em api.js cuida do cabeçalho
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ token, usuario, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};