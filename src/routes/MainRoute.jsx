import React from "react";
import Home from "../components/Home";
import JobFinder from "../components/JobFinder";
import RecuiterDashboard from "../components/RecruiterDashboard";
import JSDashboard from "../components/JSDashboard";
import Root from "../layout/Root";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,
        Component: Home,},
        
    //   { path: "signup", Component: SignUpPage },
    //   { path: "login", Component: LoginPage },
    //   { path: "error", Component: ErrorPage },
        { path: "search", Component: JobFinder },
        { path: "recruiter-dashboard", Component: RecuiterDashboard },
        { path: "job-seeker-dashboard", Component: JSDashboard },
    ],
  },
];

export default MainRouter;