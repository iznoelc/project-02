const express = require("express");
const router = express.Router();
const { createUser, getUserByUID, deleteUser } = require("../controllers/user.controller");

router.post("/", createUser);

//get all users
router.get("/", getAllUsers);

// get a specific user by their uid
router.get("/:uid", getUserByUID);

router.delete("/:id", deleteUser);

module.exports = router;