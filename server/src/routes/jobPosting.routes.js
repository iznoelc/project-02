const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createJobPosting, getJobPostingByID, deleteJobPosting } = require("../controllers/jobPosting.controller");

// CREATE job
router.post("/:uid", verifyFirebaseToken, createJobPosting);

// GET job by MongoDB _id
router.get("/:uid", verifyFirebaseToken, getJobPostingByID);

// DELETE job by MongoDB _id
router.delete("/:uid", verifyFirebaseToken, deleteJobPosting);

module.exports = router;
