import express from "express";
import {
  getAvailableOrders,
  pickOrder,
  deliverOrder,
} from "../controllers/courier.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/available-orders", verifyJWT, authorizeRoles("courier"), getAvailableOrders);
router.patch("/orders/:id/pick", verifyJWT, authorizeRoles("courier"), pickOrder);
router.patch("/orders/:id/deliver", verifyJWT, authorizeRoles("courier"), deliverOrder);

export default router;
