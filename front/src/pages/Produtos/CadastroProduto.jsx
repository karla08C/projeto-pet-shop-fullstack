import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Sua instância de API
import { usePermissions } from '../../hooks/usePermissions'; // Hook para permissões
import Swal from 'sweetalert2';

export default function CadastroProduto() {
  const navigate = useNavigate();
  // 🛑 1. OBTÉM PERMISSÕES E ID DO VENDEDOR LOGADO
  const { isVendedor, usuarioId, loading: authLoading } = usePermissions(); 

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: 0,
    categoria: '',
  });

  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para feedback de carregamento

  // 🛑 Redireciona se não for um vendedor após o carregamento da autenticação
  useEffect(() => {
    if (!authLoading && !isVendedor) {
      alert('Acesso negado. Apenas vendedores podem cadastrar produtos.');
      navigate('/');
    }
  }, [authLoading, isVendedor, navigate]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagemChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVendedor) {
        alert('Você não tem permissão para esta ação.');
        return;
    }
    
    setLoading(true);

    // 🛑 2. CRIA O FORM DATA PARA ENVIAR ARQUIVOS E DADOS JUNTOS
    const formData = new FormData();
    
    // Adiciona o arquivo (se existir)
    if (imagem) {
      formData.append('imagem', imagem); // 'imagem' deve ser o nome esperado pelo Multer no backend
    } else {
      // Se a imagem for obrigatória, adicione uma validação aqui
    }

    // Adiciona os campos de texto
    formData.append('nome', form.nome);
    formData.append('descricao', form.descricao);
    formData.append('preco', form.preco);
    formData.append('estoque', form.estoque);
    // 🛑 Usa o ID do vendedor logado (do contexto)
    formData.append('vendedor_id', usuarioId); 
    formData.append('categoria', form.categoria);
    
    try {
      // 🛑 3. ENVIO PARA A API com o cabeçalho correto para FormData
      const response = await api.post('/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Essencial para upload de arquivos
        },
      });

      Swal.fire('Sucesso!', `Produto "${response.data.nome}" cadastrado.`, 'success');

      // Limpa formulário
      setForm({
        nome: '', descricao: '', preco: '', estoque: 0, categoria: '',
      });
      setImagem(null);
      document.getElementById('input-imagem').value = null; // Limpa o input file

      navigate('/produtos');
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao cadastrar produto. Verifique os dados.';
      Swal.fire('Erro!', msg, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading) {
    return <div className="container mt-4">Verificando permissões...</div>;
  }
  
  // 🛑 4. OCULTAR PARA USUÁRIOS SEM PERMISSÃO
  if (!isVendedor) {
    return <div className="container mt-4">Acesso negado. Você não é um vendedor.</div>;
  }

  // 🛑 5. AJUSTAR O FORMULÁRIO (Remover o campo vendedor_id)
  return (
    <div className="container mt-4">
      <h2>Cadastro de Produto</h2>
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
            name="preco"
            step="0.01"
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
        
        {/* 🛑 CAMPO VENDEDOR_ID REMOVIDO: Será enviado automaticamente */}
        
        {/* Upload de imagem */}
        <div className="mb-3">
          <label className="form-label">Imagem do Produto</label>
          <input
            type="file"
            id="input-imagem" // Adicionado ID para limpeza
            accept="image/*"
            onChange={handleImagemChange}
            className="form-control"
            required // Torna o upload obrigatório
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}