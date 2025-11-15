import express from "express";
import { loginUnificado } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUnificado);

export default router;