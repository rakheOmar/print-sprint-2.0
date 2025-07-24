import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Token generator
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { email, fullname, password, role, address, phone } = req.body;

  if (
    [email, fullname, password].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError("Please fill all required fields", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists with this email", 409);
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError("Please upload an avatar image", 400);
  }

  const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUploadResult) {
    throw new ApiError("Avatar upload failed", 400);
  }

  const user = await User.create({
    fullname,
    email: email.toLowerCase(),
    password,
    avatar: avatarUploadResult.url,
    role: role || "customer",
    address: address || "",
    phone: phone || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError("User creation failed", 500);

  return res
    .status(201)
    .json(new ApiResponse(200,  "User registered successfully", createdUser));
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError("Please provide email", 400);

  const user = await User.findOne({ email });
  if (!user) throw new ApiError("User not found", 404);

  const isPassValid = await user.isPasswordCorrect(password);
  if (!isPassValid) throw new ApiError("Invalid password", 401);

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log("Login success:", {
    accessToken,
    refreshToken,
    user: loggedInUser,
  });
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "User logged in successfully",
        { user: loggedInUser, accessToken, refreshToken },
      )
    );
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  const options = { httpOnly: true, secure: true };

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully", null));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incRefreshToken) throw new ApiError("Refresh token missing", 401);

  const decoded = jwt.verify(incRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError("User not found", 404);
  if (user.refreshToken !== incRefreshToken)
    throw new ApiError("Invalid refresh token", 401);

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Token refreshed successfully"
      )
    );
});

// Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError("User not found", 404);

  const isPassCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPassCorrect) throw new ApiError("Incorrect old password", 401);

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", null,));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Current user fetched successfully", user));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};
