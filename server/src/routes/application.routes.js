const express = require("express");
const router = express.Router();
const { createApplication } = require("../controllers/application.controller");

router.post("/", createApplication);

router.get("/", (req, res) => {
    res.send("Application route is working");
});

module.exports = router;