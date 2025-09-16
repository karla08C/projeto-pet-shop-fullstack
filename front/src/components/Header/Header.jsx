import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [search, setSearch] = useState('');

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/buscar?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-principal sticky-top">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/">
          Pet Shop Feliz
        </Navbar.Brand>

        {/* Botão para telas pequenas */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Links de navegação */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/inicio">
              Início
            </Nav.Link>
            <Nav.Link as={Link} to="/agendamento">
              Agendamentos
            </Nav.Link>
            <Nav.Link as={Link} to="/produtos">
              Produtos
            </Nav.Link>
            <Nav.Link as={Link} to="/serviços">
              Serviços
            </Nav.Link>
            <Nav.Link as={Link} to="/historia">
              Nossa História
            </Nav.Link>
            <Nav.Link as={Link} to="/sobre">
              Sobre
            </Nav.Link>
            <Nav.Link as={Link} to="/contato">
              Contato
            </Nav.Link>
          </Nav>

          {/* Pesquisa + Carrinho + Login */}
          <div className="d-flex align-items-center">
            <Form
              className="d-flex me-3"
              onSubmit={handleSearch}
              style={{ maxWidth: '300px' }}
            >
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

            <Link to="/carrinho" className="cart-link position-relative me-3">
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            <Link to="/login" className="login-link">
              <FaUser />
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
