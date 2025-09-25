import React from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './Produto.css';

// O componente recebe um objeto 'produto' que agora é o produto do Banco de Dados
function Produto({ produto }) {
  // O addToCart agora é uma função assíncrona que chama a API
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // 💡 CORREÇÃO CRÍTICA: 
    // O addToCart do CartContext CORRIGIDO espera APENAS o ID do produto.
    // O próprio CartContext fará a chamada POST para o backend.
    addToCart(produto.id); 
    
    // 💡 NOTA: É comum que produtos vindos do DB tenham 'nome' em vez de 'titulo' 
    // Verifique se o seu objeto produto deve usar produto.nome aqui e na renderização.
    toast.success(`"${produto.titulo}" foi adicionado ao carrinho!`);
  };

  return (
    <div className="produto-card">
      <img
        // 💡 NOTA: O campo pode ter mudado para 'imagem_url' se o nome do campo
        // no seu backend/DB for diferente de 'imagem'. Ajuste se necessário.
        src={produto.imagem} 
        alt={produto.titulo}
        className="produto-imagem"
      />
      <h3 className="produto-titulo">{produto.titulo}</h3>
      <p className="produto-preco">
        Preço: R$ {produto.preco.toFixed(2).replace('.', ',')}
      </p>
      <p className="produto-descricao">{produto.descricao}</p>
      <button onClick={handleAddToCart} className="produto-botao-carrinho">
        Adicionar ao Carrinho
      </button>
    </div>
  );
}

export default Produto;