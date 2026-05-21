const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");
const docController = require("../controllers/documentController");

router.get(
  "/dashboard",

  authMiddleware,

  roleMiddleware("employee"),

  (req, res) => {

    res.json({
      message: "Welcome Employee Dashboard"
    });

  }
);

// Get documents assigned to the logged-in employee
router.get(
  "/documents",
  authMiddleware,
  roleMiddleware("employee"),
  docController.getAssignedDocuments
);

module.exports = router;