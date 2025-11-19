import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";

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

export {
    signUp,
}