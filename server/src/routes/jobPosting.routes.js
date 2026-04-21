const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createJobPosting, getJobPostingByID, deleteJobPosting, getAllJobPostings } = require("../controllers/jobPosting.controller");

// CREATE job
router.post("/", verifyFirebaseToken, createJobPosting);

// GET job by MongoDB _id
router.get("/:_id", verifyFirebaseToken, getJobPostingByID);

// GET all job postings
router.get("/", getAllJobPostings);

// DELETE job by MongoDB _id
router.delete("/:_id", verifyFirebaseToken, deleteJobPosting);

module.exports = router;
