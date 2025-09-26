// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Define o código de status HTTP com base na resposta atual ou padrão 500 (Erro Interno do Servidor)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Retorna a resposta JSON formatada
    res.json({
        message: err.message,
        // Inclui o stack trace (detalhes do erro) apenas se não for produção
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Exporta a função usando um export nomeado (o que o server.js espera)
export { errorHandler };