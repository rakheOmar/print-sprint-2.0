import { asyncHandler } from "../utils/asyncHandler.js";
import { Document } from "../models/document.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getPdfPageCount } from "../utils/pdfUtils.js";
import fs from "fs";

// Upload & Create Multiple Documents
const uploadDocument = asyncHandler(async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    throw new ApiError("No document files uploaded", 400);
  }

  const {
    size = "A4",
    colorType = "bw",
    binding = "false",
    copies = "1",
  } = req.body;

  const uploadedDocs = [];

  for (const file of files) {
    let pageCount = 1;

    // Count pages only for PDFs
    if (file.mimetype === "application/pdf") {
      try {
        pageCount = await getPdfPageCount(file.path);
      } catch (err) {
        throw new ApiError("Failed to read PDF page count", 500);
      }
    }

    const cloudUpload = await uploadOnCloudinary(file.path);

    if (!cloudUpload?.url) {
      throw new ApiError("Cloud upload failed", 500);
    }

    const document = await Document.create({
      user: req.user._id,
      fileUrl: cloudUpload.url,
      originalName: file.originalname,
      pageCount,
      printOptions: {
        size,
        colorType,
        binding: binding === "true",
        copies: Number(copies),
      },
    });

    uploadedDocs.push(document);
  }

  return res.status(201).json(
    new ApiResponse(201, uploadedDocs, "Documents uploaded successfully")
  );
});

// Get All Documents for Logged-in User
const getMyDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json(new ApiResponse(200, documents));
});
const getDocumentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await Document.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!document) {
    throw new ApiError("Document not found", 404);
  }

  return res.status(200).json(new ApiResponse(200,"Successful", document));
});
export { uploadDocument, getMyDocuments,getDocumentById };
