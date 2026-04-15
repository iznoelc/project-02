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
}

module.exports = { createUser };