import React from "react";
import Home from "../components/Home";
import Root from "../layout/Root";

import JobSeekerSignUpPage from "../components/authentication/JobSeekerSignUpPage";
import RecruiterSignUpPage from "../components/authentication/RecruiterSignUpPage";
import LoginPage from "../components/authentication/LoginPage";

import JobFinder from "../components/JobFinder";
import RecuiterDashboard from "../components/RecruiterDashboard";
import JSDashboard from "../components/JSDashboard";

import AdminDashboard from "../components/AdminDashboard";
import AdminJobPage from "../components/AdminJobPage";
import AdminStatsPage from "../components/AdminStatsPage";
import AdminUserPage from "../components/AdminUserPage";

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
        { path: "admin-jobpage", Component: AdminJobPage },
        { path: "admin-statspage", Component: AdminStatsPage },
        { path: "admin-userpage", Component: AdminUserPage },
        { path: "job-seeker-signup", Component: JobSeekerSignUpPage },
        { path: "recruiter-signup", Component: RecruiterSignUpPage },
        { path: "login", Component: LoginPage },
    ],
  },
];

export default MainRouter;