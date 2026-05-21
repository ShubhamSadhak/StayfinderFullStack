import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyjwt = async (req,res,next)=>{
    try{
        const token = req.cookies?.accessToken||
        req.headers?.authorization?.replace ("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized");
        }
        const decoded = await jwt.verify(token,process.env.accessToken)
        const user = await user.findById(decodedToken.id).select("_password")
        if(!user){
            throw new ApiError(401, "Unauthorized");
        }
        req.user = user
        next()
    }
    catch(error){
        throw new ApiError(401,"Unauthorized",error);
    }
}
