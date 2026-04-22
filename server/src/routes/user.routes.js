const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
const { createUser, getUserByUID, deleteUser, getAllUsers, approveRecruiter } = require("../controllers/user.controller");

router.post("/", createUser);

//get all users
router.get("/", getAllUsers);

// get a specific user by their uid
router.get("/:uid", verifyFirebaseToken, getUserByUID);

router.delete("/:uid", verifyFirebaseToken, deleteUser);

router.patch("/:uid", verifyFirebaseToken, approveRecruiter);

module.exports = router;