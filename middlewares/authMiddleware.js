import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const authGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new Error('Non autorisé, Pas de token'));
  }

  try {
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('Utilisateur introuvable'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new Error('Token invalide ou expiré'));
  }
};

export const adminGuard = async (req, _res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    let error = new Error('Non autorisé, action réservée aux administrateurs');
    error.statusCode = 401;
    next(error);
  }
};
