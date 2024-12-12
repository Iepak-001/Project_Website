import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB = async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n Mongo DB Connected !!! DB HOST: ${connectionInstance}`);
        
    } catch (error) {
        console.log("Mongo Connection Error \n",error);
        process.exit(1); //Throw ya phir exit dono se code stop kr sakte hai

    }
}

export default connectDB