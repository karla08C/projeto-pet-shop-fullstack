import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api'; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { usuario } = useAuth();
    
    const API_BASE_PATH = '/api/carrinho'; 

    // CORREÇÃO CRÍTICA: Envolver fetchCart com useCallback
    const fetchCart = useCallback(async () => {
        if (!usuario) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(API_BASE_PATH);
            
            setCartItems(response.data.itens || []); 
        } catch (error) {
            console.error('Erro ao buscar carrinho do backend:', error);
            if (error.response && (error.response.status === 404 || error.response.status === 400)) {
                setCartItems([]);
            } 
        } finally {
            setLoading(false);
        }
    }, [usuario]); // Dependência: só recria se o usuário mudar

    // Agora o useEffect depende da versão estável de fetchCart
    useEffect(() => {
        fetchCart();
    }, [fetchCart]); 

    
    const addToCart = async (productId, quantity = 1) => {
        if (!usuario) {
            alert('Você precisa estar logado para adicionar itens ao carrinho!');
            return;
        }
        
        try {
            const response = await api.post(`${API_BASE_PATH}/adicionar`, {
                produtoId: productId,
                quantidade: quantity,
            });
            
            if (response.status === 201 || response.status === 200) {
                await fetchCart(); 
                alert(`Produto adicionado ao carrinho!`);
            }

        } catch (error) {
            console.error('Falha ao adicionar item via API:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.erro || 'Erro desconhecido ao adicionar.';
            alert(`Falha ao adicionar: ${errorMessage}`);
        }
    };
    
    const removeFromCart = async (itemId) => {
        if (!usuario) return;
        try {
            await api.delete(`${API_BASE_PATH}/remover/${itemId}`);
            await fetchCart(); 
        } catch (error) {
            console.error('Falha ao remover item:', error);
            alert('Não foi possível remover o item.');
        }
    };

    const clearCart = async () => {
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