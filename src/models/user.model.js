import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';

const locationSchema = new mongoose.Schema({
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true    
    },
    city:{
        type:String,
        required:true
    },
});
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    phoneNo:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    userRole:{
        enum:['PG_Owner','Customer'],
        type:String,
        required:true
    },
    location:{
        type:locationSchema,
        required:true
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next()
})
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        userRole: this.userRole
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const User = mongoose.model('User',userSchema);
export const Location = mongoose.model('Location',locationSchema);