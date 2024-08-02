import express from "express";

import { authGuard } from "../middlewares/authMiddleware.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentControllers.js";

const router = express.Router();

router.post("/", authGuard, createComment);

router
  .route("/:commentId")
  .put(authGuard, updateComment)
  .delete(authGuard, deleteComment);

export default router;
