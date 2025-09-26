import React from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './Produto.css';

function Produto({ produto }) {
  const { addToCart } = useCart();
  
  const nomeProduto = produto.nome;
  const precoProduto = produto.preco; 
  const imagemUrl = produto.imagem_url; 

  const handleAddToCart = () => {
    addToCart(produto.id); 
    toast.success(`"${nomeProduto}" foi adicionado ao carrinho!`);
  };

  return (
    <div className="produto-card">
      <img
        src={imagemUrl} 
        alt={nomeProduto}
        className="produto-imagem"
      />
      <h3 className="produto-titulo">{nomeProduto}</h3>
      <p className="produto-preco">
        Preço: R${' '}
        {/* 🛑 CORREÇÃO: Aplica parseFloat para converter a String Decimal antes de formatar */}
        {parseFloat(precoProduto).toFixed(2).replace('.', ',')}
      </p>
      <p className="produto-descricao">{produto.descricao}</p>
      <button onClick={handleAddToCart} className="produto-botao-carrinho">
        Adicionar ao Carrinho
      </button>
    </div>
  );
}

export default Produto;