import React from 'react';
import './Produto.css';


function Produto({ titulo, preco, descricao, imagem }) {
  return (
    <div className="produto-card">
      <img src={imagem} alt={titulo} className="produto-imagem" />
      <h3 className="produto-titulo">{titulo}</h3>
      <p className="produto-preco">Preço: R$ {preco.toFixed(2).replace('.', ',')}</p>
      <p className="produto-descricao">{descricao}</p>
      <button className="produto-botao-carrinho">Adicionar ao Carrinho</button>
    </div>
  );
}

export default Produto;