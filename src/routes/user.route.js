import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { updatePassword, updateProfile } from "../controllers/update.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { customerReview,updateReview, deleteReview } from "../controllers/review.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyjwt, logoutUser)
router.route("/change-password").post(verifyJWT, updatePassword)
router.route("/update-account").patch(verifyJWT, updateProfile)
router.route("/review").post(verifyJWT, customerReview)
router.route("/deletereview").delete(verifyJWT, deleteReview)
router.route("/updatereview").put(verifyJWT, updateReview)

export default router