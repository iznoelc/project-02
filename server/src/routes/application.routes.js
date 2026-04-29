const express = require("express");
const router = express.Router();


const upload = require("../middleware/upload");  
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");

const {
  createApplication,
  getApplicationsByUserUID,
  getAllJobApplications
} = require("../controllers/application.controller");

console.log("VERIFY:", verifyFirebaseToken);
console.log("UPLOAD:", upload);
console.log("UPLOAD.SINGLE:", upload.single);
console.log("CREATE:", createApplication);

router.post(
  "/",
  verifyFirebaseToken,
  upload.single("resumeFile"), //this is the thing!!!
  createApplication
);

router.get("/:applicant_id", verifyFirebaseToken, getApplicationsByUserUID);
router.get("/", verifyFirebaseToken, getAllJobApplications);

module.exports = router;
