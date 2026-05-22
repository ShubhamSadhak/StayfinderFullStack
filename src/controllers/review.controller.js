import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { PG } from "../models/pg.model.js"
import { Review } from "../models/review.model.js"



const customerReview = asyncHandler(async(req,res)=>{
    const{pgId, review, rating} = req.body
    if(!pgId || !review || !rating){
        throw new ApiError(400,"All fields are required")
    }
    const pg = await PG.findById(pgId)
    if(!pg){
        throw new ApiError(404,"PG not found")
    }
    if(req.user.userRole !== "Customer"){
        throw new ApiError(403,"Only customers can add reviews")
    }

    const existingReview = await Review.findOne({
        pgId, 
        reviewerId:req.user._id})
    if(existingReview){
        throw new ApiError(409,"You have already reviewed this PG")
    }
    
    const newReview = await Review.create({
        pgId,
        review,
        rating,
        reviewerId:req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse (201, newReview, "Review added successfully")
    )
    
})

const updateReview = asyncHandler(async(req,res)=>{
    const{reviewId, review, rating} = req.body
    if(!reviewId || !review || !rating){
        throw new ApiError(400,"All fields are required")
    }
    const existingReview = await Review.findById(reviewId)
    if(!existingReview){
        throw new ApiError(404,"Review not found")
    }
    if (existingReview.reviewerId !== req.userId) {
        throw new ApiError(403, "Unauthorized");
    }
    existingReview.review = review;
    existingReview.rating = rating;

    await existingReview.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            existingReview,
            "Review updated successfully"
        )
    );
})

const deleteReview = asyncHandler(async(req,res)=>{
    const{reviewId} = req.body
    if(!reviewId){
        throw new ApiError(400,"Review ID is required")
    }
    const review = await Review.findById(reviewId)
    if(!review){
        throw new ApiError(404,"Review not found")
    }
    if (review.reviewerId !== req.user._id) {
        throw new ApiError(403, "Unauthorized");
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Review deleted successfully"
        )
    );
});

export {customerReview, updateReview, deleteReview}

