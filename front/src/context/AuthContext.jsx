// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. CONFIGURAÇÃO INICIAL (IMEDIATA)
const initialToken = localStorage.getItem('token');

// Configura o Axios para usar o token e lidar com cookies
if (initialToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}
axios.defaults.withCredentials = true; 
// -----------------------------------------------------------

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSessao = async () => {
      if (token) { 
        try {
          // 💡 REFORÇO: Enviamos o token explicitamente no header desta requisição
          const headers = { 'Authorization': `Bearer ${token}` };
          
          const { data } = await axios.get('http://localhost:3001/usuarios/perfil', { headers });
          setUsuario(data);
        } catch (error) {
          console.error("Token inválido ou expirado", error);
          logout();
        }
      }
      setLoading(false);
    };
    
    // Roda a verificação de sessão
    verificarSessao();
  }, [token]); // Dependência em [token] garante que o efeito roda se o token mudar

  const login = ({ token, usuario }) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUsuario(usuario);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, loading }}>
      {/* Renderiza os filhos SOMENTE após a checagem */}
      {!loading && children}
    </AuthContext.Provider>
  );
};