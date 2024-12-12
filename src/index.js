import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.db.js";
import {app} from "./app.js"

dotenv.config({
    path:'./.env'
})

// CONNECTDB Async code  hai toh 
//fn call complete ke baad response aata hai
// .then   and   .catch se handle krenge
//multiple   .then allowed


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Mongo db connection fail messege from index.js",error);
})
