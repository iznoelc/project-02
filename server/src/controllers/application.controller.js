const Application = require("../models/application.model");

/**
 * application.controller.js
 *
 * Handles application processes like creating and fetching applications.
 */

async function createApplication(req, res) {
  try {
    const { jobId, applicantId, resumeLink, cover_letter } = req.body;

    // Multer file (if uploaded)
    const resumeFile = req.file ? req.file.filename : null;

    // Check if user already applied
    const existing = await Application.findOne({
      job_id: jobId,
      applicant_id: applicantId
    });

    if (existing) {
      return res.status(409).json({
        error: "You have already applied to this job"
      });
    }

    // Required fields
    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }
    if (!applicantId) {
      return res.status(400).json({ error: "applicantId is required" });
    }

    // Require at least one: resumeLink OR resumeFile
    if (!resumeLink && !resumeFile) {
      return res.status(400).json({
        error: "Either resumeLink or resumeFile is required"
      });
    }

    // Create application
    const application = new Application({
      job_id: jobId,
      applicant_id: applicantId,
      resume_link: resumeLink || null,
      resume_file: resumeFile || null,
      cover_letter: cover_letter || null
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
