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


/**
 * Get all applications for a certian user
 * @param {} req 
 * @param {*} res 
 * @returns 
 */
async function getApplicationsByUserUID(req, res){
    try {
        console.log("request uid: ", req.user.uid);
        console.log("params uid: ", req.params.applicant_id);

        // Allow admins to view everything
        const isAdmin = req.user.admin || req.user.role === "admin" || req.user.isAdmin;

        // Block only if NOT admin AND trying to access someone else's data
        if (!isAdmin && req.params.applicant_id !== req.user.uid) {
            return res.status(403).json({ error: "Access Forbidden" });
        }


        const applications = await Application.find({
            applicant_id: req.params.applicant_id,
            
        })
        .populate({
            path: "job_id",
            match: {}
        });

        

        // ensure null job_ids arent retrieved
        const filteredApplications = applications.filter(app => app.job_id !== null);
        console.log(filteredApplications)

        if (!applications || !filteredApplications){
            return res.status(404).json({
                error: "Applications could not be found",
            });
        }

        res.status(200).json({filteredApplications});
    } catch (error){
        return res.status(500).json({message: "Server Error"});
    }
}

async function getAllJobApplications(req, res) {
    try {
        const job_applications = await Application.find();
        res.json(job_applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createApplication, getApplicationsByUserUID, getAllJobApplications };
