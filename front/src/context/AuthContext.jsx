import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
// A biblioteca jwt-decode não é mais estritamente necessária aqui, 
// mas pode ser útil para outras coisas se quiser mantê-la.

// 1. Cria o Contexto
const AuthContext = createContext();

// Hook customizado
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Para saber quando a verificação inicial terminou

  // ==================================================================
  //          ↓↓↓ LÓGICA DO USEEFFECT ATUALIZADA ↓↓↓
  // ==================================================================
  useEffect(() => {
    const verificarSessao = async () => {
      const tokenSalvo = localStorage.getItem('token');

      if (tokenSalvo) {
        // Configura o cabeçalho do Axios para todas as futuras requisições
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenSalvo}`;
        
        try {
          // CHAMA A ROTA DE PERFIL PARA VALIDAR O TOKEN E PEGAR OS DADOS DO USUÁRIO
          const { data } = await axios.get('http://localhost:3001/usuarios/perfil');
          
          // Se a chamada for bem-sucedida, o token é válido
          setUsuario(data); // Salva o objeto completo do usuário (com nome, email, etc.)
          setToken(tokenSalvo); // Garante que o estado do token está sincronizado

        } catch (error) {
          console.error("Token inválido ou sessão expirada. Fazendo logout.", error);
          // Se a API retornar um erro (ex: 401), o token não é mais válido
          logout(); 
        }
      }
      // Independente de ter token ou não, a verificação inicial terminou
      setLoading(false); 
    };

    verificarSessao();
  }, []); // O array vazio [] faz com que este hook rode APENAS UMA VEZ quando o app carrega

  const login = (dadosLogin) => {
    localStorage.setItem('token', dadosLogin.token);
    // Ao setar o token, você pode recarregar a página para disparar o useEffect
    // ou buscar os dados do perfil aqui também. A forma mais simples é recarregar:
    window.location.href = '/perfil'; // Redireciona e força o recarregamento e verificação
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUsuario(null);
  };

  const value = {
    token,
    usuario,
    loading,
    login,
    logout,
  };

  // Não renderiza o app até que a verificação inicial do token seja feita
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};