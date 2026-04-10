// this is the same as "index.js" from mini-project-7
// src: https://github.com/FahmidaHamid/backend-with-dbms-authorization
require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors"); 
const uri = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use(cors());

// validations
// import from "validations/..." like const { validateAuth } = require("validations/auth.validations.js");'

const { ObjectId } = require("mongodb");

const port = process.env.PORT || 3005; //just some port

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (err) {
    console.error(err);
  } 
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});