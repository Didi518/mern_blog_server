import express from "express";

import {
  deleteUser,
  getAllUsers,
  loginUser,
  registerUser,
  updateProfile,
  updateProfilePicture,
  userProfile,
} from "../controllers/userControllers.js";
import { adminGuard, authGuard } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authGuard, userProfile);
router.get("/", authGuard, adminGuard, getAllUsers);

router.put("/update-profile/:userId", authGuard, updateProfile);
router.put("/update-profile-picture", authGuard, updateProfilePicture);

router.delete("/:userId", authGuard, adminGuard, deleteUser);

export default router;
