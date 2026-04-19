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

/**
 * Get all applications for a certian user
 * @param {} req 
 * @param {*} res 
 * @returns 
 */
async function getApplicationsByUserUID(req, res){
    try {
        const applications = await Application.find({
            applicant_id: req.params.applicant_id
        })
        .populate("job_id");

        if (!applications){
            return res.status(404).json({
                error: "Applications could not be found",
            });
        }

        res.status(200).json({applications});
    } catch (error){
        return res.status(500).json({message: "Server Error"});
    }
}

module.exports = { createApplication, getApplicationsByUserUID };
