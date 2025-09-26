import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api'; // 🛑 Importa a API para buscar dados
import Swal from 'sweetalert2';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Buscar() {
  const query = useQuery();
  const termo = query.get('query')?.toLowerCase() || '';

  // 🛑 ESTADOS PARA DADOS REAIS
  const [todosOsProdutos, setTodosOsProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛑 FUNÇÃO PARA BUSCAR TODOS OS PRODUTOS DO BACKEND
  const fetchProdutos = useCallback(async () => {
    try {
      const response = await api.get('/produtos');
      setTodosOsProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos para pesquisa:', error);
      Swal.fire('Erro!', 'Não foi possível buscar os produtos para pesquisa.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🛑 CARREGA OS PRODUTOS NA MONTAGEM
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);


  // 🛑 FILTRO DE BUSCA
  const produtosFiltrados = todosOsProdutos.filter((p) => {
    // Usamos 'nome' do BD e 'descricao' para a pesquisa
    const nome = p.nome?.toLowerCase() || '';
    const descricao = p.descricao?.toLowerCase() || '';
    
    return nome.includes(termo) || descricao.includes(termo);
  });

  if (loading) {
    return <div className="container mt-4">Carregando catálogo para pesquisa...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Resultados para: "{termo}"</h2>

      <h3>Produtos</h3>
      {produtosFiltrados.length > 0 ? (
        <ul>
          {produtosFiltrados.map((produto) => (
            <li key={produto.id}>
              {/* Usamos 'nome' e fazemos o parseFloat no preço */}
              <strong>{produto.nome}</strong> - R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
              <p>{produto.descricao}</p>
              {/* Imagem (Se o campo no BD for imagem_url) */}
              {produto.imagem_url && (
                <img src={produto.imagem_url} alt={produto.nome} width="150" />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
}

export default Buscar;