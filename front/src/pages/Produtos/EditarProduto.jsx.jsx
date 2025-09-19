import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditarProduto() {
  const { id } = useParams(); // id do produto
  const navigate = useNavigate();

  // Estado do formulário
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    categoria: '',
  });

  const [imagem, setImagem] = useState(null); // Estado para novo arquivo
  const [imagemPreview, setImagemPreview] = useState(''); // Preview da imagem atual

  useEffect(() => {
    // Simulando produto carregado do backend
    const produtoFake = {
      nome: 'Produto Exemplo',
      descricao: 'Descrição do produto',
      preco: 99.99,
      estoque: 10,
      categoria: 'Categoria X',
      imagem_url: 'https://via.placeholder.com/150',
    };

    setForm({
      nome: produtoFake.nome,
      descricao: produtoFake.descricao,
      preco: produtoFake.preco,
      estoque: produtoFake.estoque,
      categoria: produtoFake.categoria,
    });

    setImagemPreview(produtoFake.imagem_url);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagemChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setImagem(arquivo);
      setImagemPreview(URL.createObjectURL(arquivo)); // Preview local
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Para backend real, você criaria FormData e enviaria a imagem
    console.log('Produto editado:', form);
    console.log('Nova imagem selecionada:', imagem);

    alert('Produto atualizado com sucesso!');
    navigate('/produtos');
  };

  return (
    <div className="container mt-4">
      <h2>Editar Produto</h2>
      <form onSubmit={handleSubmit} className="mt-3">
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
            step="0.01"
            name="preco"
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
          {imagemPreview && (
            <div className="mb-2">
              <img
                src={imagemPreview}
                alt="Preview"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
