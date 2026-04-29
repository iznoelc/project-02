/**
 * user.routes.js
 * 
 * Routes fulfilled by user controller
 * 
 * @author Izzy Carlson
 */

const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createUser, getUserByUID, deleteUser, getAllUsers, updateUser } = require("../controllers/user.controller");

// post a new user to the database
router.post("/", verifyFirebaseToken, createUser);

//get all users
router.get("/", verifyFirebaseToken, getAllUsers);

// get a specific user by their uid
router.get("/:uid", verifyFirebaseToken, getUserByUID);

// delete a user based on their uid
router.delete("/:uid", verifyFirebaseToken, deleteUser);

// update an existing user in the database
router.patch("/:uid", verifyFirebaseToken, updateUser);

module.exports = router;