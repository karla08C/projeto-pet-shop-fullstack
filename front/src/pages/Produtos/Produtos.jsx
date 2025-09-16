import React, { useState, useMemo } from 'react';
import Produto from '../Produto/Produto';
import './Produtos.css';
import { todosOsProdutos } from '../../data/produtosData.js';

function Produtos() {
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [ordenacao, setOrdenacao] = useState('nenhum');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 12;

  const produtosFiltrados = useMemo(() => {
    let produtos = todosOsProdutos.filter(
      (produto) =>
        produto.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(termoPesquisa.toLowerCase()),
    );

    switch (ordenacao) {
      case 'mais-barato':
        produtos.sort((a, b) => a.preco - b.preco);
        break;
      case 'mais-caro':
        produtos.sort((a, b) => b.preco - a.preco);
        break;
      default:
        break;
    }
    return produtos;
  }, [termoPesquisa, ordenacao]);

  // Paginação
  const indexUltimoProduto = paginaAtual * produtosPorPagina;
  const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;
  const produtosPaginaAtual = produtosFiltrados.slice(
    indexPrimeiroProduto,
    indexUltimoProduto,
  );

  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
  const numerosPaginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  const handleChangePage = (numero) => {
    setPaginaAtual(numero);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <section className="sectionprodutos">
        <h2 align="center" className="h2produtos">
          🐾 Nossos Produtos
        </h2>

        <div className="filtros-container">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            className="barra-pesquisa"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
          <select
            className="dropdown-ordenacao"
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
          >
            <option value="nenhum">Relevância (Padrão)</option>
            <option value="mais-barato">Preço: Do mais barato</option>
            <option value="mais-caro">Preço: Do mais caro</option>
          </select>
        </div>

        <div className="produtos-lista">
          {produtosPaginaAtual.length > 0 ? (
            produtosPaginaAtual.map((produto) => (
              <Produto key={produto.id} produto={produto} />
            ))
          ) : (
            <p className="nenhum-produto-encontrado">
              Nenhum produto encontrado com a pesquisa ou filtros aplicados.
            </p>
          )}
        </div>

        <div className="paginacao">
          <button
            onClick={() => handleChangePage(paginaAtual - 1)}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>

          {numerosPaginas.map((numero) => (
            <button
              key={numero}
              onClick={() => handleChangePage(numero)}
              className={numero === paginaAtual ? 'ativo' : ''}
            >
              {numero}
            </button>
          ))}

          <button
            onClick={() => handleChangePage(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
          >
            Próximo
          </button>
        </div>
      </section>
    </div>
  );
}

export default Produtos;
