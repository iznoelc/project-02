const jobPosting = require("../models/jobPosting.model");

async function createJobPosting(req, res) {
    try {
        const { job_title, institution, category, location, salary_range, description, req_qualifications, deadline, start_date, recruiter_id } = req.body;

        if (!job_title) return res.status(400).json({ error: "Job Title is required" });
        if (!institution) return res.status(400).json({ error: "Institution name is required" });
        if (!category) return res.status(400).json({ error: "Category is required" });
        if (!location) return res.status(400).json({ error: "Location is required" });
        if (!salary_range) return res.status(400).json({ error: "A salary range is required" });
        if (!description) return res.status(400).json({ error: "A Description is required" });
        if (!req_qualifications) return res.status(400).json({ error: "Qualifications are required" });
        if (!deadline) return res.status(400).json({ error: "A deadline is required" });
        if (!start_date) return res.status(400).json({ error: "A start date is required" });
        if (!recruiter_id) return res.status(400).json({ error: "A recruiter id is required" });

        const job_posting = new jobPosting({
            job_title,
            institution,
            category,
            location,
            salary_range,
            description,
            req_qualifications,
            deadline,
            start_date,
            recruiter_id,
        });

        await job_posting.save();
        res.status(201).json({ message: "Job Posting created successfully", job_posting });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getJobPostingByID(req, res) {
    try {
        const job_posting = await jobPosting.findById(req.params.id);

        if (!job_posting) {
            return res.status(404).json({ error: "Job posting not found" });
        }

        res.status(200).json(job_posting);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteJobPosting(req, res) {
    try {
        const deleted = await jobPosting.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Job Posting not found" });
        }

        res.json({ message: "Job Posting deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createJobPosting, getJobPostingByID, deleteJobPosting };
