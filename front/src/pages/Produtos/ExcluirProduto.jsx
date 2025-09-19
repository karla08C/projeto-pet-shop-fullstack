import React, { useState, useMemo } from 'react';
import Produto from '../Produto/Produto';
import { todosOsProdutos as produtosIniciais } from '../../data/produtosData.js';
import { useNavigate } from 'react-router-dom';

export default function Produtos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState(produtosIniciais);

  // Função para excluir produto
  const handleExcluir = (id) => {
    const confirmado = window.confirm(
      'Tem certeza que deseja excluir este produto?',
    );
    if (confirmado) {
      const novosProdutos = produtos.filter((produto) => produto.id !== id);
      setProdutos(novosProdutos);
      alert('Produto excluído com sucesso!');
    }
  };

  return (
    <div className="produtos-lista">
      {produtos.length > 0 ? (
        produtos.map((produto) => (
          <div key={produto.id} className="produto-card">
            <Produto produto={produto} />

            <div className="botoes-produto">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/editar-produto/${produto.id}`)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleExcluir(produto.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
