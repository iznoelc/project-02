const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createJobPosting, getJobPostingByID, deleteJobPosting, getAllJobPostings } = require("../controllers/jobPosting.controller");

// CREATE job
router.post("/:uid", verifyFirebaseToken, createJobPosting);

// GET job by MongoDB _id
router.get("/:uid", verifyFirebaseToken, getJobPostingByID);

// GET all job postings
router.get("/", getAllJobPostings);

// DELETE job by MongoDB _id
router.delete("/:uid", verifyFirebaseToken, deleteJobPosting);

module.exports = router;
