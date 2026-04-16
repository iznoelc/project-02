import React from "react";
import Home from "../components/Home";
import Root from "../layout/Root";
import PrivateRoute from "./PrivateRoute";
import FallbackElement from "../components/FallbackElement";

import JobSeekerSignUpPage from "../components/authentication/JobSeekerSignUpPage";
import RecruiterSignUpPage from "../components/authentication/RecruiterSignUpPage";
import LoginPage from "../components/authentication/LoginPage";
import ForgotPasswordPage from "../components/authentication/ForgotPasswordPage";

import JobFinderPage from "../components/JobFinderPage";
import RecuiterDashboard from "../components/RecruiterDashboard";
import JSDashboard from "../components/JSDashboard";

import AdminDashboard from "../components/AdminDashboard";
import ErrorPage, { ErrorBoundary } from "../components/ErrorPage";
import DetailsPage from "../components/DetailsPage";

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
            <PrivateRoute allowedRoles={["job-seeker", "admin"]}>
              <JobFinderPage />
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
          <PrivateRoute allowedRoles={["job-seeker", "admin"]}>
            <JSDashboard />
          </PrivateRoute>
          )
        },

        { path: "admin-dashboard",
          element: (
            <PrivateRoute allowedRoles={["job-seeker", "admin"]}> {/*// job seeker allowed for now for testing */}
              <AdminDashboard />
            </PrivateRoute>
          )
        },
        { path: "job-seeker-signup", Component: JobSeekerSignUpPage },
        { path: "recruiter-signup", Component: RecruiterSignUpPage },
        { path: "login", Component: LoginPage },
        { path: "forgot-password", Component: ForgotPasswordPage },
        { path: "job-details", Component: DetailsPage },
    ],
  },
  { path: "*", Component: ErrorPage }, {path: "/error", Component: ErrorPage}
];

export default MainRouter;