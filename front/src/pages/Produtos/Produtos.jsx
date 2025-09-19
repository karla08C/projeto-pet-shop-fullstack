import React, { useState, useMemo } from 'react';
import Produto from '../Produto/Produto';
import './Produtos.css';
import { todosOsProdutos } from '../../data/produtosData.js';
import { useNavigate } from 'react-router-dom';

function Produtos() {
  const navigate = useNavigate();
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [ordenacao, setOrdenacao] = useState('nenhum');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [produtos, setProdutos] = useState(todosOsProdutos); // estado local para manipulação
  const produtosPorPagina = 12;

  const produtosFiltrados = useMemo(() => {
    let filtrados = produtos.filter(
      (produto) =>
        produto.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(termoPesquisa.toLowerCase()),
    );

    switch (ordenacao) {
      case 'mais-barato':
        filtrados.sort((a, b) => a.preco - b.preco);
        break;
      case 'mais-caro':
        filtrados.sort((a, b) => b.preco - a.preco);
        break;
      default:
        break;
    }

    return filtrados;
  }, [termoPesquisa, ordenacao, produtos]);

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

  // Função para excluir produto
  const handleExcluir = () => {
    if (!produtoSelecionadoId) {
      alert('Selecione um produto primeiro!');
      return;
    }

    const confirmado = window.confirm(
      'Tem certeza que deseja excluir este produto?',
    );
    if (confirmado) {
      const novosProdutos = produtos.filter(
        (produto) => produto.id !== produtoSelecionadoId,
      );
      setProdutos(novosProdutos);
      alert('Produto excluído com sucesso!');
      setProdutoSelecionadoId('');
    }
  };

  return (
    <div className="pagina-produtos">
      {/* Filtros laterais */}
      <aside className="filtros">
        <h3>Filtrar por</h3>

        <div className="filtro-grupo">
          <h4>Tipo de Produto</h4>
          <label>
            <input type="checkbox" /> Ração
          </label>
          <label>
            <input type="checkbox" /> Brinquedos
          </label>
          <label>
            <input type="checkbox" /> Acessórios
          </label>
          <label>
            <input type="checkbox" /> Higiene
          </label>
        </div>

        <div className="filtro-grupo">
          <h4>Animal</h4>
          <label>
            <input type="checkbox" /> Cachorro
          </label>
          <label>
            <input type="checkbox" /> Gato
          </label>
          <label>
            <input type="checkbox" /> Pássaro
          </label>
          <label>
            <input type="checkbox" /> Roedor
          </label>
        </div>

        <div className="filtro-grupo">
          <h4>Marca</h4>
          <label>
            <input type="checkbox" /> Royal Canin
          </label>
          <label>
            <input type="checkbox" /> Pedigree
          </label>
          <label>
            <input type="checkbox" /> Whiskas
          </label>
        </div>

        <div className="filtro-grupo">
          <h4>Preço</h4>
          <label>
            <input type="checkbox" /> Até R$50
          </label>
          <label>
            <input type="checkbox" /> R$51 - R$100
          </label>
          <label>
            <input type="checkbox" /> Acima de R$100
          </label>
        </div>
      </aside>

      {/* Área principal */}
      <main className="produtos-area">
        <section className="sectionprodutos">
          <h2 align="center" className="h2produtos">
            🐾 Nossos Produtos
          </h2>

          {/* Botões Cadastrar, Editar e Excluir Produto */}
          <div className="botoes-produto">
            <button
              className="botao-cadastrar-produto"
              onClick={() => navigate('/cadastro-produto')}
            >
              Cadastrar Produto
            </button>

            <select
              value={produtoSelecionadoId}
              onChange={(e) => setProdutoSelecionadoId(e.target.value)}
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.titulo}
                </option>
              ))}
            </select>

            <button
              className="botao-editar-produto"
              onClick={() => {
                if (produtoSelecionadoId) {
                  navigate(`/editar-produto/${produtoSelecionadoId}`);
                } else {
                  alert('Selecione um produto primeiro!');
                }
              }}
            >
              Editar Produto
            </button>

            <button className="botao-excluir-produto" onClick={handleExcluir}>
              Excluir Produto
            </button>
          </div>

          {/* Pesquisa e ordenação */}
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

          {/* Lista de produtos */}
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

          {/* Paginação */}
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
      </main>
    </div>
  );
}

export default Produtos;
