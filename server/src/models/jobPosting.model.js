/**
 * user.model.js
 * use mongoose to enforce user schema at an application level 
 */

const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema({
    // REQUIRED FIELDS

	job_title: {type: String, required: true}, //Astronaut,

	job_id: {type: String, required: true, unique: true}, //id for the job

	institution: {type: String, required: true,}, //,

	category: {type: String, required: true,}, //Mission Specialist,

	location: {type: String, required: true,}, //United States,

	salary_range: {type: [Number], required: true,}, //[low, high],

	description: {type: String, required: true,}, //Work with us to go to space…,

	req_qualifications: {type: Array, required: true,}, //[q1, q2, …, qn],

	deadline: {type: String, required: true,}, //YYYY-MM-DD,

	start_date: {type: String, required: true,}, //YYYY-MM-DD,

	recruiter_id: {type: String, required: true,}, //recruiter_id,

}, { 
    timestamps: true
});
    
module.exports = mongoose.model("Job_Posting", jobPostingSchema);