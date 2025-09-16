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

  const handleRegister = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
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

    console.log('Usuário cadastrado:', novoUsuario);
    // Aqui você faz a chamada para sua API:
    // fetch("http://localhost:3000/usuario", { method: "POST", body: JSON.stringify(novoUsuario) })
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
