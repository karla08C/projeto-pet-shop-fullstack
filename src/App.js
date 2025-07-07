import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './components/Inicio';
import Sobre from './components/Sobre';
import Agendamento from './components/Agendamento';
import Produtos from './components/Produtos';
import Servicos from './components/Servicos';
import Contatos from './components/Contatos';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/serviços" element={<Servicos />} />
        <Route path="/contato" element={<Contatos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="#" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
