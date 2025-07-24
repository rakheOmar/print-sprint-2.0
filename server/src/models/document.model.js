import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    printOptions: {
      size: {
        type: String,
        enum: ["A4", "A3", "Letter"],
        default: "A4",
      },
      colorType: {
        type: String,
        enum: ["color", "bw"],
        default: "bw",
      },
      binding: {
        type: Boolean,
        default: false,
      },
      copies: {
        type: Number,
        default: 1,
      },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.model("Document", documentSchema);
