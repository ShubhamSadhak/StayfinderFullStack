import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const updatePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(
            400,
            "Old password and new password are required"
        );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const isPasswordCorrect =
        await user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(
            401,
            "Old password is incorrect"
        );
    }

    user.password = newPassword;

    await user.save({
        validateBeforeSave: false
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Password updated successfully"
        )
    );

});

const updateProfile = asyncHandler(async (req, res) => {

    const {
        userName,
        phoneNo,
        email,
        location
    } = req.body;

    if (
        !userName ||
        !phoneNo ||
        !email ||
        !location
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                userName,
                phoneNo,
                email,
                location
            }
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Profile updated successfully"
        )
    );

});

const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User fetched successfully"
        )
    );

});

export {
    updatePassword,
    updateProfile,
    getCurrentUser
};