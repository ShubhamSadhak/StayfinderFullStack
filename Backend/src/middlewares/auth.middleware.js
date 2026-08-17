import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyjwt = async (req,res,next)=>{
    try{
        const token =
            req.cookies?.accessToken ||
            req.headers?.authorization?.replace("Bearer ","");

        if(!token){
            throw new ApiError(401,"Please sign in to continue browsing.");
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decoded._id)
            .select("-password");

        if(!user){
            throw new ApiError(401,"User not found");
        }

        req.user = user;
        next();

    } catch(error){
        if (error?.name === "TokenExpiredError") {
            return res
                .status(401)
                .clearCookie("accessToken")
                .clearCookie("refreshToken")
                .json({
                    statusCode: 401,
                    success: false,
                    data: null,
                    message: "Session expired. Please log in again."
                });
        }

        if (error?.name === "JsonWebTokenError") {
            return res
                .status(401)
                .clearCookie("accessToken")
                .clearCookie("refreshToken")
                .json({
                    statusCode: 401,
                    success: false,
                    data: null,
                    message: "Invalid authentication token."
                });
        }

        if (error instanceof ApiError) {
            return res.status(error.statusCode || 401).json({
                statusCode: error.statusCode || 401,
                success: false,
                data: null,
                message: error.message || "Unauthorized"
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            data: null,
            message: "Authentication failed."
        });
    }
}
