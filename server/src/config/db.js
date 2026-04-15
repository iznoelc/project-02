/**
 * db.js
 * Sets up connection to mongodb 
 */

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let db;

/**
 * If not already connected, connect to the database and return the db instance 
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected with Mongoose");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { connectDB };