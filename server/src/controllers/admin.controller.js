import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// Promote a user to courier
const promoteToCourier = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "courier") {
    res.status(400);
    throw new Error("User is already a courier");
  }

  user.role = "courier";
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.fullname} has been promoted to courier`,
    user,
  });
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "-password -refreshToken"); // exclude sensitive info
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

export { promoteToCourier, getAllUsers };
