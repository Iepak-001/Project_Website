import { asyncHandler } from "../utils/asyncHandler.utils.js";
import {ApiError} from "../utils/ApiErrors.utils.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.utils.js"
import {ApiResponse} from "../utils/ApiResponse.utils.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
} 
// HELLOOOO Wold

const registerUser=asyncHandler(async(req,res)=>{
    //

    const {fullName, email,username,password}=req.body;
    
    // arr.some => check all fields for something
    //return T/F

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) { 
        throw new ApiError(400, "All fields are required")
    }
   
    

    // $or => checks ki agar dono me se koi bhi mila
    const existedUser =  await User.findOne({
        $or: [{ username }, { email }]
    })
   

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // avatar[0] me path milta hai
    // AVATAR is mandatory
    if(!req.files){
        console.log("no req files");
        
    }
    const avatarLocalPath= req.files?.avatar[0]?.path;

    console.log("hillo");

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file missing");
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log("Avatar local Path",avatarLocalPath);

 

  
    

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //Now create  user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    // Har ek entry ko unique _id

    const createdUser=await User.findById(user._id).select(
        //kya kya nhi chahiye wo mention
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "user registering error");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    
})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    console.log(user);
    console.log(password);
    
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}