import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Ícone de usuário
import './PerfilPage.css'; // Vamos criar este arquivo de CSS

const PerfilPage = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Previne erro caso o componente renderize antes do usuário ser carregado
  if (!usuario) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div id="main" className="profile-page-wrapper">
      <div className="container">
        
        <header className="major">
          <h2>Meu Perfil</h2>
          <p>Gerencie suas informações e atividades.</p>
        </header>

        <div className="box profile-card">
          <div className="profile-header">
            <FaUserCircle className="profile-avatar" />
            <h3>Bem-vindo(a), {usuario.nome}!</h3>
          </div>
          
          <hr className="linha-divisoria-pequena" />

          <div className="profile-details">
            <p>
              <strong>ID do Usuário:</strong>
              <span>{usuario.id}</span>
            </p>
            <p>
              <strong>E-mail:</strong>
              <span>{usuario.email}</span>
            </p>
            <p>
              <strong>Tipo de Conta:</strong>
              <span className="user-type">{usuario.tipo}</span>
            </p>
          </div>

          <button onClick={handleLogout} className="button large logout-button">
            Sair (Logout)
          </button>
        </div>

      </div>
    </div>
  );
};

export default PerfilPage;