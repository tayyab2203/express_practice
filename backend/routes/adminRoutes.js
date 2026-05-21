const express = require("express");

const router = express.Router();

const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const docController = require("../controllers/documentController");

// Multer setup for file uploads (in memory)
const upload = multer({ storage: multer.memoryStorage() });

const singleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.get(
  "/dashboard",

  authMiddleware,

  roleMiddleware("admin"),

  (req, res) => {

    res.json({
      message: "Welcome Admin Dashboard"
    });

  }
);

// Create role (admin only)
router.post(
  "/roles",
  authMiddleware,
  roleMiddleware("admin"),
  docController.createRole
);

// Create/upload document and assign to user (admin only)
router.post(
  "/documents",
  authMiddleware,
  roleMiddleware("admin"),
  docController.createDocument
);

// Get all documents (admin)
router.get(
  "/documents",
  authMiddleware,
  roleMiddleware("admin"),
  docController.getAllDocuments
);

// List users for admin (to assign documents)
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  docController.getUsers
);

// Upload file to Supabase Storage (admin only)
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("admin"),
  singleUpload("file"),
  docController.uploadFile
);

module.exports = router;