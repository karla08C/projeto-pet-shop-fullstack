// middleware/auth.js

import jwt from "jsonwebtoken"; // <--- Importação do JWT restaurada!

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) return res.status(401).json({ erro: "Acesso negado, token não fornecido" });

    const segredo = process.env.JWT_SECRET;

    // Log A: Diagnóstico da Chave Secreta
    console.log("-----------------------------------------");
    console.log("DIAGNÓSTICO AUTENTICAÇÃO:");
    console.log("JWT_SECRET Length:", segredo ? segredo.length : "UNDEFINED"); 
    console.log("Token recebido (primeiros 10 chars):", token.substring(0, 10));
    console.log("-----------------------------------------");

    if (!segredo) {
        console.error("ERRO CRÍTICO: JWT_SECRET não carregado no ambiente!");
        return res.status(500).json({ erro: "Erro interno de configuração do servidor." });
    }

    try {
        const payload = jwt.verify(token, segredo);
        
        // Log B: Sucesso na validação
        console.log("✅ TOKEN VALIDADO. ID:", payload.id); 
        req.usuarioId = payload.id; 
        next();
    } catch (error) {
        // Log C: Falha na validação (Causa do Loop de Login)
        console.log("❌ TOKEN FALHOU. Erro:", error.message); 
        return res.status(403).json({ erro: "Token inválido ou expirado" });
    }
};