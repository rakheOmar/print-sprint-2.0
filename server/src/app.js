import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
3;
app.use(cookieParser());

// IMPORT ROUTES
import userRoutes from "./routes/user.routes.js";
import documentRoutes from "./routes/document.routes.js";
import orderRoutes from "./routes/order.routes.js";
import courierRoutes from "./routes/courier.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";


// ROUTES DECLARATION
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/courier", courierRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/payment", paymentRoutes);


export { app };
