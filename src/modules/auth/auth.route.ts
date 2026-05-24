import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth/auth";
import { USER_ROLE } from "../../Types";

const router = Router();


router.post('/',auth(USER_ROLE.maintainer), authController.signIn )


export  const authRoute=router