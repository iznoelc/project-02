const User = require("../models/user.model");
const validator = require("../validators/user.validator");
const admin = require("firebase-admin");


async function createUser(req, res) {
    try {
        const { error, value } = validator.validateUser(req.body);

        // make sure fields are properly validated before creating the user
        if (error) {
            return res.status(400).send(error.message);
        }

        const existingUser = await User.findOne({uid: value.uid});

        if (existingUser){
            return res.status(200).json({
                message: "User already exists in the database",
                user: existingUser
            });
        }


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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    } 
};

async function getUserByUID(req, res) {
    

    try {

        console.log("request uid: ", req.user.uid);
            console.log("params uid: ", req.params.uid);
        if (req.params.uid !== req.user.uid){
            return res.status(403).json({error: "Access"})
        }

        const user = await User.findOne({ uid: req.params.uid })
        .populate({
            path: "fav_jobs",
            match: {}
        });
         // try to find the user by the request param

        // if the user couldnt be found, send a bad request response with an error msg
        if (!user) {
            return res.status(404).json({ error: "User not found" });
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
        const currentUser = await User.findOne({uid: req.user.uid});
        console.log("Current user role: ", currentUser.role);
        if (currentUser.role !== "admin"){
            return res.status(403).json({error: "Access denied"})
        }

        const user = await User.findOne({uid: req.params.uid});

        if (!user){
            console.log("uid: ", req.params.uid);
            console.log("Cannot find user to delete in database");
            return res.status(404).json({error: "Error: User was not found"});
        }

        const deleted = await User.findOneAndDelete({ uid: user.uid });

        if (!deleted) {
            console.log("error deleting user from database", );
            return res.status(404).json({ error: "Error deleting user from database" });
        }

        try {
            console.log("Attempting to delete user with uid ", user.uid);
            admin.auth().deleteUser(user.uid);
        } catch (error) {
            return res.status(500).json({message: "Error deleting user in firebase."});
        }

        res.status(200).json({ message: "User deleted successfully from firebase and database!" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function approveRecruiter(req, res){
    try {
        // verify that current user is an admin
        const currentUser = await User.findOne({uid: req.user.uid});
        console.log("Current user role: ", currentUser.role);
        if (currentUser.role !== "admin"){
            return res.status(403).json({error: "Access denied"});
        }

        const user = await User.findOne({uid: req.params.uid});
        if (!user){
            return res.status(404).json({error: "Could not find user to patch"});
        } else if (user.role !== "recruiter"){
            return res.status(400).json({error: "The user you are trying to approve is not a recruiter"});
        }

        const updatedData = req.body;

        const patched = await User.findOneAndUpdate(
            { uid: user.uid },
            { $set: updatedData, },
            { returnDocument: 'after'},
        )

        return res.status(200).json({ user: patched });
    } catch {
        res.status(500).json({error: "Server error"});
    }
}

module.exports = { createUser, getUserByUID, getAllUsers, deleteUser, approveRecruiter };