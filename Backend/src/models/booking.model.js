import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
    pgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PG",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fromDate: {
        type: Date,
        required: true
    },

    todate: {
        type: Date,
        required: true
    },

    bookingRoomType: {
        type: String,
        enum: ["Single", "Double", "Triple"],
        required: true
    },

    withFood: {
        type: Boolean,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    }

},
{
    timestamps: true
});

export const Booking = mongoose.model("Booking", bookingSchema);