import {asyncHandler} from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation
    // check if user exists
    // image upload, avatar required, 
    // upload to cloudinary
    // create user in database
    // remove password and refresh token from response
    // send response


    // get user details from frontend
    const {fullName, email, username, password} = req.body
    console.log(fullName, email, username, password)

    // validation

    /*
    if (fullName === "") {
        throw new apiError(400, "Full name is required");
    }
    */

    if (
        [fullName, email, username, password].some( (field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required");
    }

    // check if user exists
    
    /* User.findOne({email}) */

    const existingUser = await User.findOne(
        { $or: [{email}, {username}]}
    )
    if (existingUser) {
        throw new apiError(400, "User with same username or email already exists");
    }

    // Midlleware multer access to the files
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }

    // Upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new apiError(500, "Avatar upload failed")
    }

    // create user in database
    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    // check if db have the user and then remove password and refresh token from response 
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while creating the user");
    }


    // send response
    // API response

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    );

})

export {registerUser}