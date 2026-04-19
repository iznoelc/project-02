import React from "react";
import Home from "../components/Home";
import Root from "../layout/Root";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
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
import DetailsPage from "../components/DetailsPage";

import UserProfile from "../components/UserProfile";

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
            <PrivateRoute allowedRoles={["recruiter", "admin"]}>
              <RecuiterDashboard />
            </PrivateRoute>
          )
        },

        { path: "job-seeker-dashboard",
          element: (
          <PrivateRoute allowedRoles={["job_seeker", "admin"]}>
            <JSDashboard />
          </PrivateRoute>
          )
        },

        { path: "admin-dashboard",
          element: (
            <PrivateRoute allowedRoles={["job_seeker", "admin"]}> {/*// job seeker allowed for now for testing */}
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

        { path: "job-details", Component: DetailsPage },

        { path: "profile/:uid",
          element: (
            <PrivateRoute allowedRoles={["job_seeker", "admin"]}>
              <UserProfile />
            </PrivateRoute>
          )
        }
    ],
  },
  { path: "*", Component: ErrorPage }, {path: "/error", Component: ErrorPage}
];

export default MainRouter;