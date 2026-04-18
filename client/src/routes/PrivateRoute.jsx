import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FallbackElement from "../components/FallbackElement";

// pass children as props, which should be just the page that the user is allowed to go to if they are signed in
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, role } = useAuth();

  // if authentication is still loading the user, show the fallback element
  if (loading) {
    return <FallbackElement />;
  }

  // if the user is not signed in, redirect them to the login page
  if (!user || !allowedRoles) {
    return <Navigate state={location?.pathname} to="/login"></Navigate>;
  }

  // if the user is signed in, but their role is not allowed access to the page, redirect them to the error page with 403 unauthorized access
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/error" state={{ code: 403 }}></Navigate>;
  }

  // user is signed in and has proper access
  if (allowedRoles && allowedRoles.includes(role)) {
    return children;
  }
};

export default PrivateRoute;