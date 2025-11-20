import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
}

const signUp = asyncHandler(async(req, res) => {
    const { fullName, email, registrationNumber, role, password } = req.body;

    if (!email && !registrationNumber) {
        throw new apiError(400, "Choose your role first..");
    }
    if (!fullName || !role || !password) {
        throw new apiError(400, "All fields are required..")
    }

    const existingUser = await User.findOne({ $or: [{email}, {registrationNumber}]});
    if (existingUser) {
        throw new apiError(400, "You are already signed up..");
    }

    const user = await User.create({
        fullName,
        email,
        registrationNumber,
        role,
        password
    });

    const signedUpUser = await User.findById(user._id).select("-password")

    if (!signedUpUser) {
        throw new apiError(500, "Something happend during registration process..");
    }

    return res.status(201).json(
        new apiResponse(201, signedUpUser, "Signed Up successfully..")
    )
});

const logIn = asyncHandler(async(req, res) => {
    const { email, registrationNumber, password } = req.b;

    if (!email && !registrationNumber) {
        throw new apiError(400, "email or registratio number is required..");
    }

    const checkUser = await User.findOne({ $or: [{email}, {registrationNumber}]});
    if (!checkUser) {
        throw new apiError(400, "You have to signed up first..");
    }

    const checkPassword = await checkUser.isPasswordCorrect(password);
    if (checkPassword === true) {
        throw new apiError(400, "Incorrect password..");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(checkUser._id);

    const loggedInUser = await User.findById(checkUser._id).select("-password, -refreshToken");

    const option = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new apiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "Logged in successfully.."
        )
    )
});

const logOut = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new apiError(404, "User not found..");
    }

    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    );

    const option = {
        httpOnly: true, 
        secure: true
    };

    return res
    .status(200)
    .cookie("accessToken", option)
    .cookie("refreshToken", option)
    .json(
        new apiResponse(200, "Logged out successfully..")
    )
});

export {
    signUp,
    logIn,
    logOut
}