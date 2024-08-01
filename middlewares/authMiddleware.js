import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const authGuard = async (req, _res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(id).select("-password");
      next();
    } catch (error) {
      const err = new Error("Non autorisé, Echec  du token");
      err.statusCode = 401;
      next(err);
    }
  } else {
    let error = new Error("Non autorisé, Pas de token");
    error.statusCode = 401;
    next(error);
  }
};

export const adminGuard = async (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    let error = new Error("Non autorisé, action réservée aux administrateurs");
    error.statusCode = 401;
    next(error);
  }
};
