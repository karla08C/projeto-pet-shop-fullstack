import React, { useState, useEffect } from 'react';
import './Login.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    const { login, usuario } = useAuth();
    
    const navigate = useNavigate();
    const [erro, setErro] = useState('');

    // =======================================================
    // 💡 CORREÇÃO APLICADA: MUDAR O REDIRECIONAMENTO PARA A HOME
    // =======================================================
    useEffect(() => {
        // Se o objeto 'usuario' existir (ou seja, se o login foi chamado e o estado foi atualizado)
        if (usuario) {
            // Mude o destino para a HOME (/) ou para a página de agendamentos se for o objetivo principal.
            navigate('/', { replace: true }); 
        }
    }, [usuario, navigate]); 
    // =======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        try {
            // OBS: Recomendação: Mude 'fetch' para 'axios' aqui para manter a consistência com o AuthContext.
            const response = await fetch('http://localhost:3001/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json(); 
            console.log('RESPOSTA COMPLETA DO BACKEND:', data);

            if (response.ok) {
                login(data); // O useEffect cuida do redirecionamento
            } else {
                setErro(data.message || data.erro || 'Erro ao fazer login. Tente novamente.');
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