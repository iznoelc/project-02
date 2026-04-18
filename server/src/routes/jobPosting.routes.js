const express = require("express");
const router = express.Router();
const { createJobPosting, getJobPostingByID, deleteJobPosting } = require("../controllers/jobPosting.controller");

// CREATE job
router.post("/", createJobPosting);

// GET job by MongoDB _id
router.get("/:id", getJobPostingByID);

// DELETE job by MongoDB _id
router.delete("/:id", deleteJobPosting);

module.exports = router;
