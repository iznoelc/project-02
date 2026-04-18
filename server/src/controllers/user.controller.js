const User = require("../models/user.model");
const validator = require("../validators/user.validator");

async function createUser(req, res) {
    try {
        const { error, value } = validator.validateUser(req.body);

        // make sure fields are properly validated before creating the user
        if (error) {
            return res.status(400).send(error.message);
        } else {
            // create a new user with the provided fields and then save it to the database
            // then, return a success response with the created user
            const user = new User({
                uid: value.uid,
                email: value.email,
                display_name: value.display_name,
                role: value.role,
                organization: value.organization,
                website: value.website,
                location: value.location,
                approved: value.approved,
            });
            await user.save();

            res.status(201).json({ message: "User created successfully", user });
        }
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

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;

        const deleted = await User.findByIdAndDelete(userId);

        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createUser, getUserByUID, getAllUsers, deleteUser };