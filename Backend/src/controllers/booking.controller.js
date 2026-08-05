import { Booking } from "../models/booking.model.js";
import { PG } from "../models/pg.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const bookPG = asyncHandler(async (req, res) => {

    const {
        pgId,
        fromDate,
        todate,
        bookingRoomType,
        withFood
    } = req.body;

    if (
        !pgId ||
        !fromDate ||
        !todate ||
        !bookingRoomType ||
        withFood === undefined
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (req.user.userRole !== "Customer") {
        throw new ApiError(
            403,
            "Only customers can book PG"
        );
    }

    const pg = await PG.findById(pgId);

    if (!pg) {
        throw new ApiError(404, "PG not found");
    }

    const booking = await Booking.create({
        pgId,
        userId: req.user._id,
        fromDate,
        todate,
        bookingRoomType,
        withFood,
        status: "Pending"
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            booking,
            "PG booked successfully"
        )
    );
});

const getBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({
        userId: req.user._id
    })
    .populate(
        "pgId",
        "pgName location price withFood withWifi gender sharedRoom availability"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "Bookings fetched successfully"
        )
    );
});

const cancelBooking = asyncHandler(async (req, res) => {

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (
        booking.userId.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Unauthorized"
        );
    }

    booking.status = "Cancelled";

    await booking.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking cancelled successfully"
        )
    );
});

export {
    bookPG,
    getBookings,
    cancelBooking
};