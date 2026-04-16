const express = require("express");
const router = express.Router();
const { createUser, getUserByUID, deleteUser } = require("../controllers/user.controller");

router.post("/", createUser);

// get a specific user by their uid
router.get("/:uid", getUserByUID);

router.delete("/:id", deleteUser);

module.exports = router;