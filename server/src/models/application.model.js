/**
 * application.model.js
 */

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    job_id: {
        //change the ref depending on what landon names the model since he hasn't updated git yet
        type: mongoose.Schema.Types.ObjectId, required: true, ref: "Job_Posting"
    },
    applicant_id: {
        type: String, required: true,
    },
    resume_link: {
        type: String, required: true
    },
    cover_letter: {
        type: String,
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model("Application", applicationSchema);