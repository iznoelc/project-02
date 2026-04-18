const Joi = require("joi");

const userSchema = Joi.object({
    uid: Joi.string().required(), //firebase uid,
    display_name: Joi.string().min(3).max(30).required(), //user's display name,
    email: Joi.string().email().required(), //user's email,
    role: Joi.string().valid("job_seeker", "recruiter", "admin").required(), //user's role,

    // conditional fields for recruiters but not regular job-seekers
    organization: Joi.string().when("role",
        { is: "recruiter", then: Joi.required() }, 
        { is: "job_seeker", then: Joi.forbidden() }
    ), 
    location: Joi.string().when("role",
        { is: "recruiter", then: Joi.required() }, 
        { is: "job_seeker", then: Joi.forbidden() }
    ),
    website: Joi.string().uri().when("role",
        { is: "recruiter", then: Joi.required() }, 
        { is: "job_seeker", then: Joi.forbidden() }
    ),
    approved: Joi.boolean().when("role",
        { is: "recruiter", then: Joi.valid(false) }, // default for recruiters is false, but doesn't apply to other users
        { is: "job_seeker", then: Joi.forbidden() }
    ),
});

const validateUser = (user) => {
    console.log("Validating user:", user);
    return userSchema.validate(user);
}

module.exports = { validateUser };