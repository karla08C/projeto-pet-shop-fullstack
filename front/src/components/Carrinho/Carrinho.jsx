import React, { useEffect } from 'react'; // 💡 Adicionar useEffect
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; 
import Swal from 'sweetalert2';
import './Carrinho.css';
import { useNavigate } from 'react-router-dom';

const Carrinho = () => {
    // 💡 MUDANÇA: Pegar 'loading' e 'fetchCart' do contexto.
    const { cartItems, removeFromCart, clearCart, loading, fetchCart } = useCart();
    const { usuario } = useAuth(); 
    const navigate = useNavigate();

    // =======================================================
    // 1. SINCRONIZAÇÃO: Carregar carrinho ao montar ou quando o usuário muda
    // =======================================================
    useEffect(() => {
        // Se o usuário estiver logado, forçamos o carregamento dos itens do DB
        if (usuario) {
            fetchCart();
        }
    }, [usuario]); // Depende apenas de 'usuario' e 'fetchCart'

    const total = cartItems.reduce(
        (acc, item) => acc + item.produto.preco * item.quantidade,
        0,
    );

    const handleFinalizarCompra = async () => {
        if (!usuario) { 
            // ... (lógica de login)
            Swal.fire({
                icon: 'warning',
                title: 'Você precisa estar logado!',
                text: 'Faça login para finalizar sua compra.',
                confirmButtonText: 'Login',
                confirmButtonColor: '#28a745',
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        if (cartItems.length === 0) {
            // ... (lógica de carrinho vazio)
             Swal.fire({
                icon: 'info',
                title: 'Carrinho vazio',
                text: 'Adicione produtos para finalizar a compra.',
            });
            return;
        }

        try {
            // 🚀 2. Chamada para o backend (API)
            const response = await axios.post('http://localhost:3001/api/carrinho/finalizar');

            const vendaId = response.data.vendaId;

            Swal.fire({
                title: 'Compra Realizada!',
                text: `Seu pedido #${vendaId} foi concluído com sucesso.`,
                icon: 'success',
                confirmButtonText: 'Ótimo!',
                confirmButtonColor: '#28a745',
            }).then(() => {
                // 💡 CHAME O FETCH CART ou CLEAR CART do contexto para limpar a visualização
                fetchCart(); // Recarrega para mostrar o carrinho vazio
                navigate(`/`, { replace: true });
            });

        } catch (error) {
            // ... (lógica de erro)
             const errorMessage = error.response?.data?.erro || 'Erro ao processar sua compra.';
             Swal.fire({
                icon: 'error',
                title: 'Erro na Compra',
                text: errorMessage,
            });
        }
    };

 // ... (código anterior)

    // Renderização de carregamento
    if (loading) {
        return <div className="carrinho-loading">Carregando itens...</div>;
    }
    
    // =======================================================
    // 3. RENDERIZAÇÃO CORRIGIDA
    // =======================================================
    return (
        <div id="carrinho-page">
            <div className="carrinho-container">
                <h2>🐾Seu carrinho de compras 🛒</h2>

                {/* Usa a nova variável cartItems que vem da API */}
                {cartItems.length === 0 ? (
                    <p className="carrinho-vazio">Seu carrinho está vazio.</p>
                ) : (
                    <>
                        <ul className="carrinho-lista">
                            {/* Os itens vêm do backend com a estrutura: { id, quantidade, produto: {...} } */}
                            {cartItems.map((item) => (
                                <li key={item.id} className="carrinho-item">
                                    <img
                                        // 💡 CORREÇÃO 1: Usar 'imagem' (ou 'imagem_url' se for o caso)
                                        src={item.produto.imagem} 
                                        // 💡 CORREÇÃO 2: Usar 'titulo' (ou 'nome' se for o caso)
                                        alt={item.produto.titulo}      
                                        className="item-imagem"
                                    />
                                    <div className="item-info">
                                        {/* 💡 CORREÇÃO 3: Usar 'titulo' */}
                                        <span className="item-titulo">{item.produto.titulo}</span>
                                        <span className="item-preco">
                                            {item.quantidade} x R${' '}
                                            {/* 💡 CORREÇÃO 4: Usar 'preco' */}
                                            {item.produto.preco.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                    <button
                                        // Passa o ID do ITEM DO CARRINHO para a remoção
                                        onClick={() => removeFromCart(item.id)} 
                                        className="item-remover"
                                    >
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="carrinho-total">
                            <h3>Total: R$ {total.toFixed(2).replace('.', ',')}</h3>
                            <button
                                onClick={handleFinalizarCompra}
                                className="finalizar-compra"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Carrinho;