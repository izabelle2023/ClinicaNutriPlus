const UserModel = require('../models/userModel');

// Autenticacao simplificada (sem JWT): o frontend envia o id do usuario
// logado no header "x-user-id" apos o login/registro, e aqui apenas
// confirmamos que esse usuario existe no banco de dados.
async function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Usuario nao informado. Faca login novamente.' });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario invalido. Faca login novamente.' });
    }
    req.user = user; // { id, name, email, role, created_at }
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao validar usuario.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil de usuario.' });
    }
    return next();
  };
}

module.exports = { authMiddleware, requireRole };
