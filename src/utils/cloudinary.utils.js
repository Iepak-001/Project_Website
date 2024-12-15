//Cloudinary local file ka path dega

import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
//fs => file system operations
import fs from "fs"
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null

        //upload file

        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file is uploaded
        console.log("File sucessfully upluaded \n",response.url);
        fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        //File upload me error
        //Toh temp file ko server se delete krdo
        console.log("File upload fail");
        
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadOnCloudinary}