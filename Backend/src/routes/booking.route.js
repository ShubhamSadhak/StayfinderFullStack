import {
    bookPG,
    getBookings,
    cancelBooking
} from "../controllers/booking.controller.js";

import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/bookpg")
.post(verifyjwt, bookPG);

router.route("/getbookings")
.get(verifyjwt, getBookings);

router.route("/cancelbooking/:bookingId")
.patch(verifyjwt, cancelBooking);

export default router;