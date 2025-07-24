import express from "express";
import { promoteToCourier } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.patch("/users/:id/promote", verifyJWT, authorizeRoles("admin"), promoteToCourier);

export default router;
