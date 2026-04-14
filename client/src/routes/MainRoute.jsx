import React from "react";
import Home from "../components/Home";
import Root from "../layout/Root";

import JobSeekerSignUpPage from "../components/authentication/JobSeekerSignUpPage";
import RecruiterSignUpPage from "../components/authentication/RecruiterSignUpPage";
import LoginPage from "../components/authentication/LoginPage";
import ForgotPasswordPage from "../components/authentication/ForgotPasswordPage";

import JobFinderPage from "../components/JobFinderPage";
import RecuiterDashboard from "../components/RecruiterDashboard";
import JSDashboard from "../components/JSDashboard";

import AdminDashboard from "../components/AdminDashboard";
import ErrorPage from "../components/ErrorPage";
import DetailsPage from "../components/DetailsPage";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,
        Component: Home,},
        { path: "error", Component: ErrorPage },
        { path: "*", Component: ErrorPage },
        { path: "search", Component: JobFinderPage },
        { path: "recruiter-dashboard", Component: RecuiterDashboard },
        { path: "job-seeker-dashboard", Component: JSDashboard },
        { path: "admin-dashboard", Component: AdminDashboard },
        { path: "job-seeker-signup", Component: JobSeekerSignUpPage },
        { path: "recruiter-signup", Component: RecruiterSignUpPage },
        { path: "login", Component: LoginPage },
        { path: "forgot-password", Component: ForgotPasswordPage },
        { path: "job-details", Component: DetailsPage },
    ],
  },
];

export default MainRouter;