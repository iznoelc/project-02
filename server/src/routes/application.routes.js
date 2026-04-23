const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createApplication, getApplicationsByUserUID, getAllJobApplications } = require("../controllers/application.controller");

router.post("/", verifyFirebaseToken, createApplication);

// router.get("/:uid", verifyFirebaseToken, (req, res) => {
//     res.send("Application route is working");
// });

router.get("/:applicant_id", verifyFirebaseToken, getApplicationsByUserUID);

router.get("/", verifyFirebaseToken, getAllJobApplications);

module.exports = router;