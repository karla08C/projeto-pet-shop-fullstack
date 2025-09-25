import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { usuario, token } = useAuth();
    
    const API_URL = 'http://localhost:3001/api/carrinho'; 

    // =======================================================
    // 1. SINCRONIZAÇÃO: Carrega o carrinho do backend
    // =======================================================
    const fetchCart = async () => {
        if (!usuario) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            
            // O backend retorna um objeto de carrinho que tem uma propriedade 'itens'
            setCartItems(response.data.itens || []); 
        } catch (error) {
            console.error('Erro ao buscar carrinho do backend:', error);
            // Se o erro for 404 (carrinho não existe), não deve quebrar a sessão.
            if (error.response && error.response.status === 404) {
                 setCartItems([]);
            } else {
                 // Deixe o AuthContext cuidar de 401/403
            }
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCart();
    }, [usuario, token]); 
    // =======================================================
    
    // =======================================================
    // 2. OPERAÇÕES: Modifica o carrinho via API
    // =======================================================
    
    const addToCart = async (productId, quantity = 1) => {
        if (!usuario) {
            alert('Você precisa estar logado para adicionar itens ao carrinho!');
            return;
        }
        
        try {
            const response = await axios.post(`${API_URL}/adicionar`, {
                produtoId: productId,
                quantidade: quantity,
            });
            
            // 💡 CORREÇÃO: Força o recarregamento dos dados do DB
            if (response.status === 201) {
                await fetchCart(); 
            }

        } catch (error) {
            console.error('Falha ao adicionar item via API:', error);
            // O erro mais provável aqui é o produto não estar no DB (400)
            alert(`Falha ao adicionar: ${error.response?.data?.erro || 'Produto não encontrado.'}`);
        }
    };

    // ... (removeFromCart e clearCart permanecem os mesmos, pois já chamam fetchCart)
    
    const removeFromCart = async (itemId) => {
         if (!usuario) return;
         // ... (try/catch)
         await axios.delete(`${API_URL}/remover/${itemId}`);
         await fetchCart(); 
         // ...
    };

    const clearCart = async () => {
        // Por enquanto, apenas recarrega para mostrar o carrinho vazio após a compra
        // Adicione uma rota DELETE /api/carrinho para limpar o DB se necessário.
        await fetchCart();
    };
    
    const value = {
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart 
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};