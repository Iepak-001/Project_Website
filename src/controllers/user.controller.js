import { asyncHandler } from "../utils/asyncHandler.utils.js";


const registerUser=asyncHandler(async(req,res)=>{
    res.status(200).json({
        messege:"Postman data recieved from user control"
    })
})

export {registerUser}