/**
 * application.model.js
 *
 * Defines required variables and types needed for the application processes.
 */

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Job_Posting"
  },
  applicant_id: {
    type: String,
    required: true
  },

  // Resume URL (optional now)
  resume_link: {
    type: String,
    default: null
  },

  // Resume file (optional)
  resume_file: {
    type: String,
    default: null
  },

  cover_letter: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Application", applicationSchema);
