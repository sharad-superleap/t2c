import express from "express";
import { getLoggedInUser, loginUser, registerUser } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(authMiddleware, getLoggedInUser)

export default router;