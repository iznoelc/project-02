const express = require("express");
const router = express.Router();
const { createUser, getUserByUID } = require("../controllers/user.controller");

router.post("/", createUser);

// get a specific user by their uid
router.get("/:uid", getUserByUID);

module.exports = router;