const Application = require("../models/application.model");

async function createApplication(req, res) {
    try {
        const { jobId, applicantId, resumeLink } = req.body;

        if (!jobId) {
            return res.status(400).json({ error: "jobId is required" });
        }
        if (!applicantId) {
            return res.status(400).json({ error: "applicantId is required" });
        }
        if (!resumeLink) {
            return res.status(400).json({ error: "resumeLink is required" });
        }

        const application = new Application({
            jobId,
            applicantId,
            resumeLink
        });

        await application.save();

        res.status(201).json({
            message: "Application created successfully",
            application
        });

    } catch (err) {
        console.error("Error creating application:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createApplication };
