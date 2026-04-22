import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FallbackElement from "../components/FallbackElement";

// pass children as props, which should be just the page that the user is allowed to go to if they are signed in
const PrivateRoute = ({ children }) => {
  const { user, loading, role, approved } = useAuth();

  // if authentication is still loading the user, show the fallback element
  if (loading) {
    return <FallbackElement />;
  }

  // if the user is not signed in, redirect them to the login page
  if (!user) {
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
  }

  // if the user is a recruiter and they are not yet approved
  if (role === "recruiter" && !approved) {
    return <Navigate to="/approval-pending"></Navigate>;
  }

  // user is a recruiter AND they are approved
  if (role === "recruiter" && approved) {
    return children;
  }
};

export default PrivateRoute;