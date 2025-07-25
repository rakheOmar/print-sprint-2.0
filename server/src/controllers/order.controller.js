import axios from "axios";
import { Order } from "../models/order.model.js";
import { Document } from "../models/document.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOrderEmail } from "../utils/emailService.js";

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const {
    documentIds,
    deliveryAddress,
    customerName,
    customerPhone,
    customerEmail,
    paymentType,
  } = req.body;

  if (!Array.isArray(documentIds) || documentIds.length === 0) {
    throw new ApiError("At least one document must be selected", 400);
  }

  const documents = await Document.find({ _id: { $in: documentIds } });
  if (documents.length !== documentIds.length) {
    throw new ApiError("One or more documents not found", 404);
  }

  let totalAmount = 0;
  documents.forEach((doc) => {
    const ratePerPage = doc.printOptions.colorType === "color" ? 5 : 2;
    const totalPages = doc.pageCount * doc.printOptions.copies;
    totalAmount += ratePerPage * totalPages;
  });

  const order = await Order.create({
    user: req.user._id,
    documents: documentIds,
    deliveryAddress,
    customerName,
    customerPhone,
    customerEmail,
    paymentType,
    totalAmount,
    status: "ordered",
  });

  try {
    await sendOrderEmail({
      to_email: customerEmail,
      customerName,
      orderId: order._id.toString(),
      totalAmount,
    });
    console.log("Order email sent successfully");
  } catch (err) {
    console.error("Email sending failed:", err.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Order placed successfully", order));
});

// Get orders for the logged-in user
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("documents")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Orders retrieved successfully", orders));
});

// Get all orders (Admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("documents")
    .populate("user", "fullname email")
    .populate("assignedCourier", "fullname email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "All orders retrieved successfully", orders));
});

// Cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  if (!order.user.equals(req.user._id)) {
    throw new ApiError("You are not authorized to cancel this order", 403);
  }

  const cancellableStatuses = ["pending", "preparing"];
  if (!cancellableStatuses.includes(order.status)) {
    throw new ApiError("Order cannot be cancelled at this stage", 400);
  }

  order.status = "cancelled";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Order cancelled successfully", order));
});

export { createOrder, getMyOrders, getAllOrders, cancelOrder };
