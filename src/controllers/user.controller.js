import {asyncHandler} from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // storing the refresh token in the user object
        user.refreshToken = refreshToken
        // saving the user object without validation to avoid password validation
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token")
    }
}


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
    // console.log(fullName, email, username, password)

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
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

   let coverImageLocalPath;
   if(req.files && req.files.coverImage && req.files.coverImage[0]) {
         coverImageLocalPath = req.files.coverImage[0].path
    }

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
    
    // console.log(req.body);
    // console.log(req.files);

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    );


})

const loginUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // username or email
    // find user
    // check if user exists
    // check if password is correct
    // generate access and refresh token
    // send cookies

    const {username, email, password} = req.body
    if(!username && !email) {
        throw new apiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new apiError(404, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, "Incorrect password")
    }

    const {accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // updating the user object as the prev user object did not have access token and refresh token
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    
    }

    return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new apiResponse(
                    200, 
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged in successfully"
                )
            )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    
    // clear cookies
    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
    }

    return res
            .status(200)
            .clearCookie("refreshToken", options)
            .clearCookie("accessToken", options)
            .json(new apiResponse(200, {}, "User logged out successfully"))

})

export {registerUser, loginUser, logoutUser}