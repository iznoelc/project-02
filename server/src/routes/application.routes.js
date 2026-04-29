/**
 * application.routes.js
 *
 * Routes to be fulfilled by the model and controller.
 *
 * @author 
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const {
  createApplication,
  getApplicationsByUserUID,
  getAllJobApplications
} = require("../controllers/application.controller");

// Multer (middleware to handle file upload)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Routes

// takes resumeLink or resumeFile
router.post(
  "/",
  verifyFirebaseToken,
  upload.single("resumeFile"),
  createApplication
);

router.get("/:applicant_id", verifyFirebaseToken, getApplicationsByUserUID);

router.get("/", verifyFirebaseToken, getAllJobApplications);

module.exports = router;
