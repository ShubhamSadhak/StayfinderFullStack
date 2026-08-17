import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { VerifiedPhone } from "../models/verifiedPhone.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        };

    } catch (error) {
        throw new ApiError(
            500,
            "Internal Server Error while generating access and refresh tokens"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {

    const {
        userName,
        phoneNo,
        email,
        location,
        password,
        userRole
    } = req.body;

    if (
        !userName ||
        !phoneNo ||
        !email ||
        !location ||
        !password ||
        !userRole
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = String(phoneNo).replace(/\D/g, '');

    if (!/^[0-9]{10}$/.test(normalizedPhone)) {
        throw new ApiError(400, "Invalid phone number");
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        );
    }

    const verifiedPhone = await VerifiedPhone.findOne({
        phoneNo: normalizedPhone,
        verified: true
    });

    if (!verifiedPhone) {
        throw new ApiError(
            400,
            "Phone number not verified"
        );
    }

    const emailExist = await User.findOne({ email: normalizedEmail });
    if (emailExist) {
        throw new ApiError(409, "Email already registered");
    }

    const phoneExist = await User.findOne({ phoneNo: normalizedPhone });
    if (phoneExist) {
        throw new ApiError(409, "Phone number already registered");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const newUser = await User.create([
            {
                userName,
                phoneNo: normalizedPhone,
                email: normalizedEmail,
                userRole,
                location,
                password,
                phoneVerified: true,
            },
        ], { session });

        const createdUser = await User.findById(newUser[0]._id)
            .select("-password -refreshToken")
            .session(session);

        if (!createdUser) {
            throw new ApiError(
                500,
                "Error while creating user"
            );
        }

        await VerifiedPhone.deleteOne({ phoneNo: normalizedPhone }).session(session);

        await session.commitTransaction();

        return res.status(201).json(
            new ApiResponse(
                201,
                createdUser,
                "User registered successfully"
            )
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password."
        );
    }

    const isPasswordValid =
        await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid email or password."
        );
    }

    const {
        accessToken,
        refreshToken
    } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser =
        await User.findById(user._id)
            .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie(
            "accessToken",
            accessToken,
            options
        )
        .cookie(
            "refreshToken",
            refreshToken,
            options
        )
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie(
            "accessToken",
            options
        )
        .clearCookie(
            "refreshToken",
            options
        )
        .json(
            new ApiResponse(
                200,
                null,
                "User logged out successfully"
            )
        );
});

export {
    registerUser,
    loginUser,
    logoutUser
};