import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"


// Express ke andar => request, response
//middlewares 
//middlewares on express ka use krte hai
// app.use( ) se

const app=express()

//cors batata hai kaha kaha se request accept krenge

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

//JSON file jo recieve ho rha uska limit
app.use(express.json({
    limit:"64kb"
}))

// encoded url (deepak%20Kumar) ko accept krana
app.use(express.urlencoded({
    extended:true
}))

// Files ka storage public folder me
app.use(express.static("public"))

//secure cookies
app.use(cookieParser())

//ROUTES LANA HAI
import userRouter from './routes/user.routes.js'

//Routes declaration
app.use("/users",userRouter) //userRouter ko control de dega



export {app}