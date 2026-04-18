const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createApplication } = require("../controllers/application.controller");

router.post("/:uid", verifyFirebaseToken, createApplication);

router.get("/:uid", verifyFirebaseToken, (req, res) => {
    res.send("Application route is working");
});

module.exports = router;