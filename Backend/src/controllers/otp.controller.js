import twilio from "twilio";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { VerifiedPhone } from "../models/verifiedPhone.model.js";

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendOTP = asyncHandler(async (req, res) => {

    const { phoneNo } = req.body;

    if (!phoneNo) {
        throw new ApiError(
            400,
            "Phone number is required"
        );
    }

    await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
            to: `+91${phoneNo}`,
            channel: "sms"
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "OTP sent successfully"
        )
    );
});

const verifyOTP = asyncHandler(async (req, res) => {

    const { phoneNo, otp } = req.body;

    if (!phoneNo || !otp) {
        throw new ApiError(
            400,
            "Phone number and OTP are required"
        );
    }

    const verificationCheck =
        await client.verify.v2
            .services(
                process.env.TWILIO_VERIFY_SERVICE_SID
            )
            .verificationChecks.create({
                to: `+91${phoneNo}`,
                code: otp
            });

    if (
        verificationCheck.status !== "approved"
    ) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }

    await VerifiedPhone.findOneAndUpdate(
    { phoneNo },
    {
        verified: true
    },
    {
        upsert: true,
        new: true
    }
);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Phone verified successfully"
        )
    );
});

export {
    sendOTP,
    verifyOTP
};