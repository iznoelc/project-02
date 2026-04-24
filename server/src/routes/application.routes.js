/**
 * application.routes.js
 * 
 * Routes to be fufilled by the model and controller later on.
 * 
 * @author Esperanza Paulino
 */

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createApplication, getApplicationsByUserUID, getAllJobApplications } = require("../controllers/application.controller");

router.post("/", verifyFirebaseToken, createApplication);

router.get("/:applicant_id", verifyFirebaseToken, getApplicationsByUserUID);

router.get("/", verifyFirebaseToken, getAllJobApplications);

module.exports = router;