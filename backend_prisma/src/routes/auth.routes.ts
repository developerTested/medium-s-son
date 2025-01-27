import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { currentUser, forgotPassword, logoutUser, resetPassword, signIn, signUp, socialLoginAndSignup } from "../controllers/auth.controller";
import { LoginSchema, RegisterSchema, SocialRegisterSchema } from "../schema/authSchema";

const authRouter = Router();

authRouter.post("/login", validateRequest(LoginSchema), signIn);

authRouter.post("/register", validateRequest(RegisterSchema), signUp);

authRouter.post("/social", validateRequest(SocialRegisterSchema), socialLoginAndSignup);

authRouter.post("/logout", authMiddleware, logoutUser);

authRouter.post("/currentUser", authMiddleware, currentUser);

// Password Reset
authRouter.post("/password/forgot", forgotPassword);

authRouter.patch("/password/reset/:token", resetPassword);

export default authRouter;