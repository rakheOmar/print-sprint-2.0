import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";

// Get all available orders for courier
const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    status: "pending",
    assignedCourier: null,
  }).populate("user", "name email");

  res.status(200).json({ success: true, orders });
});

// Mark an order as picked
const pickOrder = asyncHandler(async (req, res) => {
  const courierId = req.user._id;
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (!order || order.status !== "pending" || order.assignedCourier) {
    res.status(400);
    throw new Error("Order is not available for pickup");
  }

  order.assignedCourier = courierId;
  order.status = "picked";
  await order.save();

  res.status(200).json({ success: true, message: "Order picked", order });
});

// Mark an order as delivered
const deliverOrder = asyncHandler(async (req, res) => {
  const courierId = req.user._id;
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (!order || String(order.assignedCourier) !== String(courierId)) {
    res.status(403);
    throw new Error("Unauthorized to deliver this order");
  }

  if (order.status !== "picked") {
    res.status(400);
    throw new Error("Order is not in picked state");
  }

  order.status = "delivered";
  await order.save();

  res.status(200).json({ success: true, message: "Order delivered", order });
});

export { getAvailableOrders, pickOrder, deliverOrder };
