import monngoose from 'mongoose'

const pgSchema = new monngoose.Schema({
    pgName:{
        type:String,
        required:true
    },
    location:{
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
    }
    },
    price:{
        type:Number,
        required:true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    withFood:{
        type:Boolean,
        required:true
    },
    withWifi:{
        type:Boolean,
        required:true
    },
    gender:{
        enum:['Male','Female','Unisex'],
        type:String,
        required:true
    },
    sharedRoom:{
        enum:['Single','Double','Triple'],
        type:String,
        required:true
    },
    availability:{
        enum:['Available','Not Available'],
        type:String,
        required:true
    }
},{timestamps:true})

export const PG = mongoose.model('PG',pgSchema)