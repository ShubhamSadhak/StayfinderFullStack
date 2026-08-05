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

    const verifiedPhone =
        await VerifiedPhone.findOne({
            phoneNo,
            verified: true
        });

    if (!verifiedPhone) {
        throw new ApiError(
            400,
            "Phone number not verified"
        );
    }

    const userExist = await User.findOne({
        $or: [
            { email },
            { phoneNo }
        ]
    });

    if (userExist) {
        throw new ApiError(
            409,
            "User already exists"
        );
    }

    const newUser = await User.create({
        userName,
        phoneNo,
        email,
        userRole,
        location,
        password,
        phoneVerified: true
    });

    const createdUser =
        await User.findById(newUser._id)
            .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Error while creating user"
        );
    }

    await VerifiedPhone.deleteOne({
        phoneNo
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }

    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email"
        );
    }

    const isPasswordValid =
        await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid password"
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