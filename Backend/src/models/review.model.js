import mongoose from 'mongoose';


const reviewSchema = new mongoose.Schema({
    pgId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PG',
    },
    review:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    reviewerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps:true})

export const Review = mongoose.model('Review',reviewSchema)