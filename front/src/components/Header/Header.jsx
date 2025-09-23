import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  NavDropdown, // <-- Adicionado para o menu do usuário
} from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // 1. IMPORTE O USEAUTH
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [search, setSearch] = useState('');

  // 2. PEGUE AS INFORMAÇÕES E FUNÇÕES DO CONTEXTO DE AUTENTICAÇÃO
  const { token, usuario, logout } = useAuth();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/buscar?query=${encodeURIComponent(search)}`);
    }
  };

  // 3. CRIE A FUNÇÃO DE LOGOUT
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-principal sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Pet Shop Feliz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Seus links de navegação continuam aqui */}
            <Nav.Link as={Link} to="/inicio">Início</Nav.Link>
            <Nav.Link as={Link} to="/agendamento">Agendamentos</Nav.Link>
            <Nav.Link as={Link} to="/produtos">Produtos</Nav.Link>
            <Nav.Link as={Link} to="/serviços">Serviços</Nav.Link>
            <Nav.Link as={Link} to="/historia">Nossa História</Nav.Link>
            <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
            <Nav.Link as={Link} to="/contato">Contato</Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            {/* Formulário de Pesquisa */}
            <Form className="d-flex me-3" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Pesquisar"
                className="me-2"
                aria-label="Pesquisar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline-light" type="submit">
                Buscar
              </Button>
            </Form>

            {/* Ícone do Carrinho (sempre visível) */}
            <Link to="/carrinho" className="cart-link position-relative me-3">
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            {/* ======================================================= */}
            {/* 4. LÓGICA DE LOGIN/LOGOUT (RENDERIZAÇÃO CONDICIONAL) */}
            {/* ======================================================= */}
            {token ? (
              // SE ESTIVER LOGADO, MOSTRA O MENU DO USUÁRIO
              <NavDropdown 
                title={
                  <>
                    <FaUser className="me-2" />
                    {/* Exibe o nome do usuário ou 'Perfil' como fallback */}
                    {usuario?.nome || 'Perfil'} 
                  </>
                } 
                id="basic-nav-dropdown" 
                align="end"
              >
                <NavDropdown.Item as={Link} to="/perfil">Minha Conta</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/meus-pedidos">Meus Pedidos</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Sair
                </NavDropdown.Item>
              </NavDropdown>

            ) : (
              // SE NÃO ESTIVER LOGADO, MOSTRA O ÍCONE DE LOGIN
              <Link to="/login" className="login-link">
                <FaUser />
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;