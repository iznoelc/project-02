const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createUser, getUserByUID, deleteUser, getAllUsers, updateUser } = require("../controllers/user.controller");

router.post("/", verifyFirebaseToken, createUser);

//get all users
router.get("/", verifyFirebaseToken, getAllUsers);

// get a specific user by their uid
router.get("/:uid", verifyFirebaseToken, getUserByUID);

router.delete("/:uid", verifyFirebaseToken, deleteUser);

router.patch("/:uid", verifyFirebaseToken, updateUser);

module.exports = router;