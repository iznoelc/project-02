const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/user.controller");

router.post("/", createUser);

// this is to test if the route is working, (i.e. typing in the browser /users)
// will later implement into yser controller "getUsers" and "getAllUsers" to get the specific users instead of just displaying
// a general message.
router.get("/", (req, res) => {
    res.send("User route is working");
});

module.exports = router;