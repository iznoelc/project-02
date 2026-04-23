const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createJobPosting, getJobPostingByID, deleteJobPosting, getAllJobPostings } = require("../controllers/jobPosting.controller");

// create job
router.post("/", verifyFirebaseToken, createJobPosting);

// get job by MongoDB _id
router.get("/:id", verifyFirebaseToken, getJobPostingByID);

// get all job postings
router.get("/", verifyFirebaseToken, getAllJobPostings);

// delete job by MongoDB _id
router.delete("/:_id", verifyFirebaseToken, deleteJobPosting);

module.exports = router;
