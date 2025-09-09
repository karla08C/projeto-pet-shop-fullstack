import React from 'react';
import { useLocation } from 'react-router-dom';
import { todosOsProdutos } from '../../data/produtosData';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Buscar() {
  const query = useQuery();
  const termo = query.get('query')?.toLowerCase() || '';

  const produtosFiltrados = todosOsProdutos.filter((p) =>
    p.titulo.toLowerCase().includes(termo),
  );

  return (
    <div className="container mt-4">
      <h2>Resultados para: "{termo}"</h2>

      <h3>Produtos</h3>
      {produtosFiltrados.length > 0 ? (
        <ul>
          {produtosFiltrados.map((produto) => (
            <li key={produto.id}>
              <strong>{produto.titulo}</strong> - R$ {produto.preco.toFixed(2)}
              <p>{produto.descricao}</p>
              {/* Se quiser, pode adicionar a imagem: */}
              {/* <img src={produto.imagem} alt={produto.titulo} width="150" /> */}
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
