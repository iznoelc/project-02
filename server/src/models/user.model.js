/**
 * user.model.js
 * use mongoose to enforce user schema at an application level 
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uid: {
        type: String, required: true, unique: true
    },
        display_name: {
        type: String, required: true, unique: true
    },
    role: {
        type: String, enum: ["job_seeker", "recruiter", "admin"], default: "job_seeker"
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);