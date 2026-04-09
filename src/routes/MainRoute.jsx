import React from "react";
import Home from "../components/Home";
import JobFinder from "../components/JobFinder";
import RecuiterDashboard from "../components/RecruiterDashboard";
import JSDashboard from "../components/JSDashboard";
import Root from "../layout/Root";
import AdminDashboard from "../components/AdminDashboard";
import ErrorPage from "../components/ErrorPage";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,
        Component: Home,},
      { index: true,
        Component: AdminDashboard,},

        
    //   { path: "signup", Component: SignUpPage },
    //   { path: "login", Component: LoginPage },
        { path: "error", Component: ErrorPage },
        { path: "*", Component: ErrorPage },
        { path: "search", Component: JobFinder },
        { path: "recruiter-dashboard", Component: RecuiterDashboard },
        { path: "job-seeker-dashboard", Component: JSDashboard },
        { path: "admin-dashboard", Component: AdminDashboard },
    ],
  },
];

export default MainRouter;