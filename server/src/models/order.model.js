import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "pending",  
        "ordered",
        "picked",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedCourier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    document: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document",
        required: true,
      },
    ],
    deliveryAddress: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
