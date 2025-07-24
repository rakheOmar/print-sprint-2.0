import express from "express";
import {
  uploadDocument,
  getMyDocuments,
  getDocumentById  
} from "../controllers/document.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/upload", verifyJWT, upload.array("documents", 5), uploadDocument);
router.get("/my", verifyJWT, getMyDocuments);
router.get("/my/:id", verifyJWT, getDocumentById);
export default router;
