import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroProduto() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: 0,
    vendedor_id: '',
    categoria: '',
  });

  const [imagem, setImagem] = useState(null); // Estado separado para o arquivo

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagemChange = (e) => {
    setImagem(e.target.files[0]); // Pega o primeiro arquivo selecionado
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Para teste, mostramos os dados no console
    console.log('Produto cadastrado:', form);
    console.log('Imagem selecionada:', imagem);

    alert('Produto cadastrado com sucesso!');

    // Limpa formulário
    setForm({
      nome: '',
      descricao: '',
      preco: '',
      estoque: 0,
      vendedor_id: '',
      categoria: '',
    });
    setImagem(null);

    // Redireciona para listagem de produtos
    navigate('/produtos');
  };

  return (
    <div className="container mt-4">
      <h2>Cadastro de Produto</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        {/* Outros campos... */}
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preço</label>
          <input
            type="number"
            name="preco"
            step="0.01"
            value={form.preco}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Estoque</label>
          <input
            type="number"
            name="estoque"
            value={form.estoque}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">ID do Vendedor</label>
          <input
            type="number"
            name="vendedor_id"
            value={form.vendedor_id}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <input
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Upload de imagem */}
        <div className="mb-3">
          <label className="form-label">Imagem do Produto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
