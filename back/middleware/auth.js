import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ erro: "Acesso negado, token não fornecido" });

  try {
    const segredo = process.env.JWT_SECRET; 
    const payload = jwt.verify(token, segredo);
    req.usuarioId = payload.id; 
    next();
  } catch (error) {
    return res.status(403).json({ erro: "Token inválido" });
  }
};
