/**
 * user.model.js
 * use mongoose to enforce user schema at an application level 
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // REQUIRED FIELDS
    uid: {
        type: String, required: true, unique: true
    },
        display_name: {
        type: String, required: true, unique: true
    },
    role: {
        type: String, enum: ["job_seeker", "recruiter", "admin"], default: "job_seeker"
    },

    // CONDITIONAL FIELDS FOR RECRUITERS
    organization: { 
        type: String,
        required: function() { return this.role === "recruiter"; }
     },
    location: {
        type: String,
        required: function() { return this.role === "recruiter"; }
    },
    website: {
        type: String,
        required: function() { return this.role === "recruiter"; }
    },
    approved: {
        type: Boolean, 
        default: false,
        required: function() { return this.role === "recruiter" ? false: undefined; } // default for recruiters is false, but doesn't apply to other users
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);