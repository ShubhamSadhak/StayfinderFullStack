import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser
} from "../controllers/user.controller.js";

import {
    updatePassword,
    updateProfile,
    getCurrentUser
} from "../controllers/update.controller.js";

import { verifyjwt } from "../middlewares/auth.middleware.js";
import {
    customerReview,
    updateReview,
    deleteReview
} from "../controllers/review.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyjwt, logoutUser);

router.route("/change-password")
.post(verifyjwt, updatePassword);

router.route("/update-account")
.patch(verifyjwt, updateProfile);

router.route("/current-user")
.get(verifyjwt, getCurrentUser);

router.route("/review")
.post(verifyjwt, customerReview);

router.route("/updatereview")
.put(verifyjwt, updateReview);

router.route("/deletereview")
.delete(verifyjwt, deleteReview);

export default router;