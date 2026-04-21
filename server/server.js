// this is the same as "index.js" from mini-project-7
// src: https://github.com/FahmidaHamid/backend-with-dbms-authorization


require("dotenv").config();
if (process.env.LOCAL_DNS_FIX === "true") {
  require("./localFix.js");
}
const express = require("express");
const cors = require("cors"); 
const { connectDB } = require("./src/config/db");

const port = process.env.PORT; //just some port

const app = express();
app.use(express.json());
app.use(cors());

// routes
const userRoutes = require("./src/routes/user.routes");
const applicationRoutes = require("./src/routes/application.routes");
const jobPostingRoutes = require("./src/routes/jobPosting.routes")


// validations
// import from "validations/..." like const { validateAuth } = require("validations/auth.validations.js");'

// connect to the database
connectDB(); 

app.use("/users", userRoutes); // use the user routes

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/applications", applicationRoutes); //use the application route

app.use("/job_postings", jobPostingRoutes); // use the job posting route

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
  
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//   } catch (err) {
//     console.error(err);
//   } 
//   finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});