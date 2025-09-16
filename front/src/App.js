import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// NOSSAS PÁGINAS E COMPONENTES
import Header from './components/Header/Header';
import Inicio from './pages/Inicio/Inicio';
import Sobre from './pages/Sobre/Sobre';
import Agendamento from './pages/Agendamentos/Agendamento';
import Produtos from './pages/Produtos/Produtos';
import Carrinho from './components/Carrinho/Carrinho';
import Servicos from './pages/Servicos/Servicos';
import Contatos from './pages/Contato/Contatos';
import Footer from './components/Footer/Footer';
import Produto from './pages/Produto/Produto';
import Historia from './pages/Historia/Historia';
import Buscar from './pages/Buscar/Buscar';
import Login from './pages/Login/Login';
import LoginCadastro from './pages/LoginCadastro/LoginCadastro'; // 👈 importei aqui

// IMPORTAÇÕES GLOBAIS
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/CartContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Header />
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/serviços" element={<Servicos />} />
          <Route path="/contato" element={<Contatos />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<LoginCadastro />} />{' '}
          {/* 👈 rota nova */}
        </Routes>
        <Footer />
      </CartProvider>
    </Router>
  );
}

export default App;
