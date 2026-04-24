// *** NOT FINISHED
const Joi = require("joi");

const jobPostingSchema = Joi.object({
	job_title: Joi.string().min(3).max(100).required(), // i.e. "Astronaut"

	institution: Joi.string().min(2).max(100).required(), // i.e. "NASA"

	category: Joi.string().min(2).max(100).required(), //Mission Specialist,

	location: Joi.string().min(2).max(100).required(), //United States,

	salary_range: Joi.arrary().items(Joi.number().positive().required()).length(2).required(), //[low, high],

	description: Joi.string().min(10).max(1000).required(), //Work with us to go to space…,

	req_qualifications: Joi.array().required(), //[q1, q2, …, qn]

	deadline: {type: String, required: true,}, //YYYY-MM-DD,

	start_date: {type: String, required: true,}, //YYYY-MM-DD,

	recruiter_id: Joi.string().required(), //recruiter_id,
});