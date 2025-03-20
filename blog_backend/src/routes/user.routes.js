import { Router } from "express";
import { registerUser, loginUser, userProfile, logoutUser } from "../controllers/user.controllers.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(userProfile);
router.route("/logout").post(logoutUser)
export default router;