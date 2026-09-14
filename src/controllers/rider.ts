import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import { Rider } from "../model/rider.js";

export const addRiderProfile = TryCatch(async (req : AuthenticatedRequest , res) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({
            msg : 'Unauthrized'
        })
    }
    if(user.role !== 'rider'){
        return res.status(403).json({
            msg : "Only riders can create rider profile"
        })
    }
    const file = req.file;
    if(!file){
        return res.status(400).json({
            msg : "rider image is requrid"
        })
    }
    const fileBuffer = getBuffer(file);
    if(!fileBuffer?.content){
        return res.status(500).json({
            msg : "failed to genrate buffer"
        })
    }

    const {data : uploadResult} = await axios.post(`${process.env.UTILS_SERVER}/api/upload` , 
        {
            buffer : fileBuffer.content
        }
    );

    const {phoneNumber ,aadharNumber , drivingLicenseNumber,lattitude,longitude} = req.body;
    if(!phoneNumber || !aadharNumber || !drivingLicenseNumber || lattitude === undefined || longitude === undefined){
        return res.status(400).json({
            msg : "All fields are requrid"
        })
    }

    const existingProfile = await Rider.findOne({
        userId : user._id.toString()
    });
    if(existingProfile){
        return res.status(400).json({
            msg : "Rider profile already exist"
        })
    }
    const riderProfile = await Rider.create({
        userId : user._id.toString(),
        pictuer : uploadResult.url,
        phoneNumber,
        aadharNumber,
        drivingLicenseNumber,
        location : {
            type : 'Point',
            coordinates : [longitude , lattitude]
        },
        isAvailble : false,
        isVerified : false
    });

    return res.status(200).json({
        msg : "Rider profile created suucessfully",
        riderProfile
    })
});

export const fetchMyProfile = TryCatch(async(req : AuthenticatedRequest , res) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({
            msg : 'Unauthrized'
        })
    }

    const account = await Rider.findOne({
        userId : user._id.toString(),
    });

    res.status(200).json(account);
});

export const toggleRiderAvailablity = TryCatch(async(req : AuthenticatedRequest , res) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({
            msg : 'Unauthrized'
        })
    }
    if(user.role !== 'rider'){
        return res.status(403).json({
            msg : "Only riders can create rider profile"
        })
    }
    const {isAvailble , lattitude , longitude} = req.body;
    if(typeof isAvailble !== 'boolean'){
        return res.status(400).json({
            msg : "isAvailabe must be boolean"
        });
    }

    if(lattitude === undefined || longitude === undefined){
        return res.status(400).json({
            msg : "locatione is requrid"
        });
    }
    const rider = await Rider.findOne({
        userId : user._id.toString(),
    });
    if(!rider){
        return res.status(400).json({
            msg : "rider profile not found"
        });
    }
    if(isAvailble && !rider.isVerified){
        return res.status(400).json({
            msg : "rider is not verified"
        });
    }
    rider.isAvailble = isAvailble;
    rider.location = {
        type : 'Point',
        coordinates : [longitude , lattitude]
    };
    rider.lastActive = new Date();
    await rider.save();
    res.json({
        msg : isAvailble ? 'Rider is now online' : 'Rider is now offline',
        rider
    });
})