import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth/auth";
import { USER_ROLE } from "../../Types";

const router = Router();


router.post('/', authController.signIn )


export  const authRoute=router