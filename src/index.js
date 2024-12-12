import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.db.js";

dotenv.config({
    path:'./.env'
})

// CONNECTDB Async code  hai toh 
//fn call complete ke baad response aata hai
// .then   and   .catch se handle krenge
connectDB()
.then
