import express from "express";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createOrder);
router.get("/my", verifyJWT, getMyOrders);
router.put("/cancel/:orderId", verifyJWT, cancelOrder);
router.put("/all", verifyJWT, authorizeRoles("admin"), getAllOrders);

export default router;
