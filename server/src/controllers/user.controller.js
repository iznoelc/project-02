const User = require("../models/user.model");

async function createUser(req, res) {
    try {
        const { uid, display_name, email, role } = req.body;

        // make sure all fields are provided
        if (!uid) {
            return res.status(400).json({ error: "UID is required" });
        }
        if (!display_name) {
            return res.status(400).json({ error: "Display name is required" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!role) {
            return res.status(400).json({ error: "Role is required" });
        }

        // create a new user with the provided fields and then save it to the database
        // then, return a success response with the created user
        const user = new User({
            uid,
            email,
            display_name,
            role,
        });
        await user.save();

        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } 
};

async function getUserByUID(req, res) {
    try {
        const user = await User.findOne({ uid: req.params.uid }); // try to find the user by the request param

        // if the user couldnt be found, send a bad request response with an error msg
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        res.status(200).json({ user }); // if the user was found, send a success response with the user
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createUser, getUserByUID };