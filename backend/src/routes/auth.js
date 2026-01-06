import express from "express";
import { register, login, logout, me, forgotPassword, resetPassword } from "../controllers/authController.js";
import { body } from "express-validator";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",
  body("name").notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  register
);

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

router.post("/forgot_password", forgotPassword);
router.post("/reset_pass/:token", resetPassword);


export default router;
