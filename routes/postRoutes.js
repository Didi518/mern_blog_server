import express from "express";

import { adminGuard, authGuard } from "../middlewares/authMiddleware.js";
import { createPost, updatePost } from "../controllers/postControllers.js";

const router = express.Router();

router.post("/", authGuard, adminGuard, createPost);

router.put("/:slug", authGuard, adminGuard, updatePost);

export default router;
