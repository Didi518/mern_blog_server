import express from "express";

import { adminGuard, authGuard } from "../middlewares/authMiddleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postControllers.js";

const router = express.Router();

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPosts);

router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;
