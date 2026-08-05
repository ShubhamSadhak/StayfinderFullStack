import mongoose from "mongoose";

const verifiedPhoneSchema = new mongoose.Schema(
{
    phoneNo: {
        type: Number,
        required: true,
        unique: true
    },

    verified: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

export const VerifiedPhone =
mongoose.model(
    "VerifiedPhone",
    verifiedPhoneSchema
);