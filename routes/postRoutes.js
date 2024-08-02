import express from "express";

import { adminGuard, authGuard } from "../middlewares/authMiddleware.js";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../controllers/postControllers.js";

const router = express.Router();

router.post("/", authGuard, adminGuard, createPost);

router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;
