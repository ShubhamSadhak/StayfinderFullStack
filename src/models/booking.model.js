import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    pgId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PG',
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    fromDate:{
        type:Date,
        required:true
    },
    todate:{
        type:Date,
        required:true
    },
    status:{
        enum:['Pending','Confirmed','Cancelled'],
        type:String,
        default:'Pending'
    }

},{timestamps:true})

export const Booking = mongoose.model('Booking',bookingSchema);

