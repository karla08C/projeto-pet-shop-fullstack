import React, { useState } from 'react';
import './Login.css';
import { FaGoogle } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa mensagens de erro anteriores

    try {
      const response = await fetch('http://localhost:3001/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        // Se a resposta for 200-299, o login foi um sucesso
        const data = await response.json();
        alert('Login bem-sucedido!');
        
        // Aqui você pode salvar o token ou informações do usuário (ex: em localStorage)
        // localStorage.setItem('token', data.token);

        // Opcional: Redirecionar o usuário para a página principal
        window.location.href = '/'; 
      } else {
        // Se o status for um erro (ex: 401, 404), exibe a mensagem de erro do backend
        const errorData = await response.json();
        setErro(errorData.message || 'Erro ao fazer login. Tente novamente.');
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