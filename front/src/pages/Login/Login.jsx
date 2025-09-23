import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // <-- MUDANÇA: Importar o useNavigate
import { FaGoogle } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const auth = useAuth();
  const navigate = useNavigate(); // <-- MUDANÇA: Inicializar o hook de navegação
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      // Nota: Verifique se a URL da sua API está correta (ex: com /api/ na frente)
      const response = await fetch('http://localhost:3001/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json(); // <-- MUDANÇA: Parseia o JSON aqui para usar em ambos os casos
      console.log('RESPOSTA COMPLETA DO BACKEND:', data);

      if (response.ok) {
        // --- A LÓGICA DE SUCESSO FOI ALTERADA AQUI ---

        // 1. Chame a função login do AuthContext, passando os dados recebidos (token, usuário)
        auth.login(data); // <-- MUDANÇA PRINCIPAL

        // 2. Redirecione o usuário para uma página protegida
        navigate('/perfil'); // <-- MUDANÇA: Use navigate em vez de window.location.href

      } else {
        // Se o status for um erro, exibe a mensagem de erro do backend
        setErro(data.message || 'Erro ao fazer login. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🐾Entrar🐾</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <div className="login-links">
            <a href="#">Esqueceu a senha?</a>
          </div>
          {erro && <p className="error-message">{erro}</p>}
          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>

        <div className="google-login">
          <button className="btn-google" type="button">
            <FaGoogle className="icon" />
            Entrar com o Google
          </button>
        </div>

        <div className="register-link">
          <p>
            Não tem uma conta? <a href="/cadastro">Crie uma agora</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;