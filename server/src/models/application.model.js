/**
 * application.model.js
 */

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    jobId: {
        //change the ref depending on what landon names the model since he hasn't updated git yet
        type: mongoose.Schema.Types.ObjectId, required: true, ref: "Job"
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"
    },
    resumeLink: {
        type: String, required: true
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model("Application", applicationSchema);