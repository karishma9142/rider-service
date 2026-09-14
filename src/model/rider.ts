import mongoose, { Document, Schema } from "mongoose";

export interface IRider extends Document {
    userId : string ,
    pictuer : string,
    phoneNumber : string,
    aadharNumber : string,
    drivingLicenseNumber : string,
    isVerified : boolean,
    location : {
        type : 'Point',
        coordinates : [number , number]
    };
    isAvailble : boolean,
    lastActive : Date,
    createdAt : Date,
    updateAt : Date
}

const schema = new Schema<IRider> (
    {
        userId : {
            type : String ,
            required : true,
            unique : true
        },
        pictuer : {
            type : String,
            required : true
        },
        phoneNumber : {
            type : String,
            required : true,
            trim : true
        },
        aadharNumber : {
            type : String,
            required : true
        },
        drivingLicenseNumber : {
            type : String,
            required : true
        },
        isVerified : {
            type : Boolean,
            default : false
        },
        location : {
            type : {
                type : String,
                enum : ['Point'],
                default : 'Point'
            },
            coordinates : {
                type : [Number],
                required : true
            },
        },
        isAvailble :  {
            type : Boolean,
            default : false
        },
        lastActive : {
            type : Date,
            default : Date.now,
        }
    },
    {
        timestamps : true
    }
);

schema.index({location : '2dsphere'}); 

export const Rider =  mongoose.model<IRider>('Rider' , schema);