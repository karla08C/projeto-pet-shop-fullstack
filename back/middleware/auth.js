import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';

// =======================================================
// MIDDLEWARE DE AUTENTICAÇÃO (verificarToken)
// =======================================================
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) return res.status(401).json({ erro: "Acesso negado, token não fornecido" });

    const segredo = process.env.JWT_SECRET;

    if (!segredo) {
        console.error("ERRO CRÍTICO: JWT_SECRET não carregado no ambiente!");
        return res.status(500).json({ erro: "Erro interno de configuração do servidor." });
    }

    try {
        const payload = jwt.verify(token, segredo);
        
        // 🛑 ANEXAR ID E TIPO (CRUCIAL)
        req.usuarioId = payload.id; 
        req.usuarioTipo = payload.tipo; 
        
        next();
    } catch (error) {
        return res.status(403).json({ erro: "Token inválido ou expirado" });
    }
};

// =======================================================
// MIDDLEWARE DE AUTORIZAÇÃO (isVendedor)
// =======================================================
// 🛑 GARANTINDO O USO CORRETO DO asyncHandler
export const isVendedor = asyncHandler(async (req, res, next) => {
    // Obtém o tipo anexado por verificarToken
    const tipo = req.usuarioTipo; 

    // O código aqui já está assumindo que você corrigiu o BD para 'Vendedor' ou 'Admin'
    if (tipo === 'vendedor' || tipo === 'Admin') {
        next(); // Permissão concedida
    } else {
        res.status(403); // Proibido
        // O asyncHandler garante que este erro será pego pelo errorHandler global.
        throw new Error('Acesso negado. Você não tem permissão de Vendedor ou Administrador.');
    }
});