import express from "express";

import {
  loginUser,
  registerUser,
  updateProfile,
  updateProfilePicture,
  userProfile,
} from "../controllers/userControllers.js";
import { authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authGuard, userProfile);

router.put("/update-profile", authGuard, updateProfile);
router.put("/update-profile-picture", authGuard, updateProfilePicture);

export default router;
