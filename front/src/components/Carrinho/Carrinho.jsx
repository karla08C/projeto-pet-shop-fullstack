import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './Carrinho.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // 🛑 Importar a instância 'api'

const Carrinho = () => {
    const { cartItems, removeFromCart, loading, fetchCart } = useCart();
    const { usuario } = useAuth(); 
    const navigate = useNavigate();

    // SINCRONIZAÇÃO: Chama fetchCart (agora estável) quando o usuário muda
    useEffect(() => {
        if (usuario) {
            fetchCart();
        }
    }, [usuario, fetchCart]); 

    // CÁLCULO TOTAL (CORRIGIDO: Aplicando parseFloat)
    const total = cartItems.reduce(
        (acc, item) => acc + parseFloat(item.produto.preco) * item.quantidade,
        0,
    );

    const handleFinalizarCompra = async () => {
        if (!usuario) { 
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
            Swal.fire({
                icon: 'info',
                title: 'Carrinho vazio',
                text: 'Adicione produtos para finalizar a compra.',
            });
            return;
        }

        try {
            // CORREÇÃO CRÍTICA: USAR A INSTÂNCIA 'api' para enviar o token
            const response = await api.post('/carrinho/finalizar');

            const vendaId = response.data.vendaId;

            Swal.fire({
                title: 'Compra Realizada!',
                text: `Seu pedido #${vendaId} foi concluído com sucesso.`,
                icon: 'success',
                confirmButtonText: 'Ótimo!',
                confirmButtonColor: '#28a745',
            }).then(() => {
                fetchCart();
                navigate(`/`, { replace: true });
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao processar sua compra.';
            Swal.fire({
                icon: 'error',
                title: 'Erro na Compra',
                text: errorMessage,
            });
        }
    };

    if (loading) {
        return <div className="carrinho-loading">Carregando itens...</div>;
    }
    
    return (
        <div id="carrinho-page">
            <div className="carrinho-container">
                <h2>🐾Seu carrinho de compras 🛒</h2>

                {cartItems.length === 0 ? (
                    <p className="carrinho-vazio">Seu carrinho está vazio.</p>
                ) : (
                    <>
                        <ul className="carrinho-lista">
                            {cartItems.map((item) => (
                                <li key={item.id} className="carrinho-item">
                                    <img
                                        src={item.produto.imagem_url || '/placeholder.jpg'} 
                                        alt={item.produto.nome} 
                                        className="item-imagem"
                                    />
                                    <div className="item-info">
                                        <span className="item-titulo">{item.produto.nome}</span>
                                        <span className="item-preco">
                                            {item.quantidade} x R${' '}
                                            {/* 🛑 CORREÇÃO CRÍTICA: Aplicar parseFloat */}
                                            {parseFloat(item.produto.preco).toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)} 
                                        className="item-remover"
                                    >
                                        Remover
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="carrinho-total">
                            <h3>
                                Total: R${' '}
                                {total.toFixed(2).replace('.', ',')}
                            </h3>
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