import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Sua instância de API
import { usePermissions } from '../../hooks/usePermissions'; // Hook para permissões
import Swal from 'sweetalert2';

export default function EditarProduto() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { isVendedor, authLoading } = usePermissions();

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    categoria: '',
  });

  const [imagem, setImagem] = useState(null); // Variável que contém o OBJETO FILE para o backend
  const [imagemPreview, setImagemPreview] = useState(''); // Variável que contém a URL para o <img>
  const [loading, setLoading] = useState(true); 

  // EFEITO: CARREGAR DADOS DO PRODUTO E VERIFICAR PERMISSÕES
  useEffect(() => {
    if (authLoading) return;

    if (!isVendedor) {
      alert('Acesso negado. Apenas vendedores podem editar produtos.');
      navigate('/produtos');
      return;
    }

    const fetchProduto = async () => {
      try {
        const response = await api.get(`/produtos/${id}`); 
        const produto = response.data;

        setForm({
          nome: produto.nome || '',
          descricao: produto.descricao || '',
          preco: String(produto.preco || ''), 
          estoque: String(produto.estoque || ''),
          categoria: produto.categoria || '',
        });
        
        // 🛑 URL BUSTING NO CARREGAMENTO: Garante que a imagem antiga não seja cacheada
        const urlComBusting = produto.imagem_url 
            ? `${produto.imagem_url}?v=${Date.now()}` 
            : 'https://via.placeholder.com/150';

        setImagemPreview(urlComBusting);
      } catch (error) {
        Swal.fire('Erro!', 'Não foi possível carregar o produto.', 'error');
        navigate('/produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id, isVendedor, authLoading, navigate]);

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
      // Cria a URL temporária do navegador para o preview
      const localUrl = URL.createObjectURL(arquivo);
      setImagemPreview(`${localUrl}?v=${Date.now()}`); 
    }
  };

  // HANDLER DE SUBMISSÃO: CRIAÇÃO E ENVIO DO FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVendedor) return; 

    setLoading(true);

    const formData = new FormData();
    
    // Adiciona os campos de texto
    formData.append('nome', form.nome);
    formData.append('descricao', form.descricao);
    formData.append('preco', form.preco);
    formData.append('estoque', form.estoque);
    formData.append('categoria', form.categoria);
    
    // 🛑 ESSENCIAL: Anexa o OBJETO FILE (variável 'imagem')
    if (imagem) {
      formData.append('imagem', imagem); 
    }

    try {
      // EXECUTA O PUT e recebe o objeto atualizado
      const response = await api.put(`/produtos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      const updatedProduct = response.data; 

      Swal.fire('Sucesso!', 'Produto atualizado com sucesso.', 'success');
      
      // 🛑 FORÇA O RECARREGAMENTO DA IMAGEM ATUALIZADA
      const newImageUrl = updatedProduct.imagem_url 
        ? `${updatedProduct.imagem_url}?v=${Date.now()}` 
        : 'https://via.placeholder.com/150';

      setImagemPreview(newImageUrl); 
      setImagem(null); 
      
      // Navega para ver a lista atualizada
      navigate('/produtos');
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao atualizar produto. Verifique a URL do backend.';
      Swal.fire('Erro!', msg, 'error');
    } finally {
      setLoading(false);
    }
  };


  if (authLoading || loading) {
    return <div className="container mt-4">Carregando produto e verificando permissões...</div>;
  }
  
  if (!isVendedor) {
    return null; 
  }


  return (
    <div className="container mt-4">
      <h2>Editar Produto: {form.nome}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        
        {/* Campo Nome */}
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

        {/* Campo Descrição */}
        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Campo Preço */}
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

        {/* Campo Estoque */}
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

        {/* Campo Categoria */}
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
          <label className="form-label">Imagem do Produto (Atual)</label>
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

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}