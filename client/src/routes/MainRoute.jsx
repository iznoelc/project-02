/**
 * MainRoute.jsx
 * 
 * The main route that outlines paths for all components and utilizes the various private routes to properly handle routing based on role or approval status.
 * 
 * @author Izzy Carlson
 */

import React from "react";
import Home from "../components/Home";
import Root from "../layout/Root";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ApprovalPendingRoute from "./ApprovalPendingRoute"
import FallbackElement from "../components/FallbackElement";

import JobSeekerSignUpPage from "../components/authentication/JobSeekerSignUpPage";
import RecruiterSignUpPage from "../components/authentication/RecruiterSignUpPage";
import LoginPage from "../components/authentication/LoginPage";
import ForgotPasswordPage from "../components/authentication/ForgotPasswordPage";

import JobFinder from "../components/JobFinder";
import RecuiterDashboard from "../components/RecruiterDashboard";
import JSDashboard from "../components/JSDashboard";

import AdminDashboard from "../components/AdminDashboard";
import ErrorPage, { ErrorBoundary } from "../components/ErrorPage";
import JobDetailsPage from "../components/JobDetailsPage";
import JobApplicationsPage from "../components/JobApplicationPage";

import UserProfile from "../components/profile/UserProfile";
import ApprovalPendingPage from "../components/ApprovalPendingPage";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true,
        Component: Home,
        HydrateFallback: FallbackElement,
      },
        { path: "*", Component: ErrorPage },

        { path: "search",
          element: (
            <PrivateRoute allowedRoles={["job_seeker", "admin"]}>
              <JobFinder />
            </PrivateRoute>
          )
        },

        { path: "recruiter-dashboard",
          element: (
              <PrivateRoute allowedRoles={["recruiter"]}>
                <ApprovalPendingRoute>
                  <RecuiterDashboard />
                </ApprovalPendingRoute>
              </PrivateRoute>
          )
        },

        { path: "job-seeker-dashboard",
          element: (
          <PrivateRoute allowedRoles={["job_seeker"]}>
            <JSDashboard />
          </PrivateRoute>
          )
        },

        { path: "admin-dashboard",
          element: (
            <PrivateRoute allowedRoles={["admin"]}> {/*// job seeker allowed for now for testing */}
              <AdminDashboard />
            </PrivateRoute>
          )
        },

        { path: "job-seeker-signup",
          element: (
            <PublicRoute>
              <JobSeekerSignUpPage />
            </PublicRoute>
          )
        },

        { path: "recruiter-signup",
          element: (
            <PublicRoute>
              <RecruiterSignUpPage />
            </PublicRoute>
          )
        },

        { path: "login",
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          )
        },

        { path: "forgot-password",
          element: (
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          )
        },

        {
          path: "jobs/:_id",
          element: (
            <PrivateRoute allowedRoles={["job_seeker", "admin"]}>
              <JobDetailsPage />
            </PrivateRoute>
          )
        },

        {
          path: "job_postings/:_id/applications",
          element: (
            <PrivateRoute allowedRoles={["job_recruiter", "admin"]}>
              <JobApplicationsPage />
            </PrivateRoute>
          )
        },

        { path: "profile/:uid",
          element: (
            
              <PrivateRoute allowedRoles={["job_seeker", "recruiter", "admin"]}>
                <ApprovalPendingRoute>
                  <UserProfile />
                </ApprovalPendingRoute>
              </PrivateRoute>
          )
        },

        { path: "approval-pending",
          element: (
            <PrivateRoute allowedRoles={["recruiter"]}>
              <ApprovalPendingPage />
            </PrivateRoute>
          )
        },
    ],
  },
  { path: "*", Component: ErrorPage }, {path: "/error", Component: ErrorPage}
];

export default MainRouter;