import React, { useState } from 'react';
import './LoginCadastro.css';

function LoginCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    const novoUsuario = {
      nome,
      email,
      senha,
      tipo,
      cpf_cnpj: cpfCnpj,
      telefone,
      endereco,
    };

    try {
      const response = await fetch('http://localhost:3001/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoUsuario),
      });

      if (response.ok) {
        // Se a resposta for 201 (Created), o cadastro foi um sucesso
        const data = await response.json();
        setSucesso('Usuário cadastrado com sucesso!');
        console.log('Usuário cadastrado:', data);

        // Limpar o formulário
        setNome('');
        setEmail('');
        setSenha('');
        setConfirmarSenha('');
        setTipo('cliente');
        setCpfCnpj('');
        setTelefone('');
        setEndereco('');
      } else {
        // Se a resposta for um erro (ex: 400, 409), exibe a mensagem de erro do backend
        const errorData = await response.json();
        setErro(errorData.message || 'Erro ao cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
  };

  return (
    <div className="loginCadastro-container">
      <div className="loginCadastro-box">
        <h2>🐾Criar Conta🐾</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
          </select>
          <input
            type="text"
            placeholder="CPF ou CNPJ"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          {erro && <p className="error-message">{erro}</p>}
          {sucesso && <p className="success-message">{sucesso}</p>}

          <button type="submit" className="btn-loginCadastro">
            Cadastrar
          </button>
        </form>

        <div className="login-link">
          <p>
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginCadastro;