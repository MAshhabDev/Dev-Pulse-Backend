import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth/auth";
import { USER_ROLE } from "../../Types";

const router = Router();

router.post("/signup", authController.signUp);

router.post("/login", authController.signIn);

export const authRoute = router;
