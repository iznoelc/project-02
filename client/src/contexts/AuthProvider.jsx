/** AuthProvider.jsx
 * provides the authentication context for the app, using firebase's authentication system.
 * currently provides ways to get the user, loading state, createUser (email & google), signInUser (email & google), and signOutUser.
 * also uses onAuthStateChanged observer from firebase to determine when a user is logged in or not and update states accordingly.
 */

import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { AuthContext } from "./AuthContext";
import FallbackElement from "../components/FallbackElement";

const googleProvider = new GoogleAuthProvider();

// passing a children prop -->
const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();
    
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [approved, setApproved] = useState(false);
  const [favJobs, setFavJobs] = useState([]);
  const [roleLoading, setRoleLoading] = useState(true);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  const sendPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        setApproved(false);
        setFavJobs([]);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);
      try {
        const token = await currentUser.getIdToken();

        let res = await fetch(`${import.meta.env.VITE_API_URL}/users/${currentUser.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });

        let data = await res.json();
        console.log("USER FETCH: ", data);
      
        if (!res.ok && res.status === 404){
          throw new Error(data?.message || "Failed to fetch user");
        }
        console.log("ROLE RESPONSE: ", data);

        setRole(data.user?.role || data.role);
        
        if (data.user?.role === "recruiter" || data.role === "recruiter"){
          setApproved(data.user?.approved || data.approved);
        }
        setFavJobs(data.user?.fav_jobs || data.fav_jobs);
        console.log("favJobs set in auth:", data.user?.fav_jobs);
        
      } catch (err) {
        console.error("Error fetching user role or approval:", err);
        setRole(null);
      }

      
      setLoading(false);
      setRoleLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchUser = async (uid, token) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed user fetch");

      const data = await res.json();

      setRole(data.user?.role || data.role);
      setApproved(data.user?.approved || data.approved);
      setFavJobs(data.user?.fav_jobs || data.fav_jobs);
  };

  // useEffect(() => {

  // }, [user]);

  // prevents error if auth is still loading and the user is trying to access a protected route
  // i.e. if user is trying to access dashboard and refreshes, prevents an error from showing if they are already logged in 
  if (loading || roleLoading) {
    return <div className="pt-64"><FallbackElement /></div>;
  }

  // all variables that should be passed from this provider to its children so it can be used in all child components
  const authInfo = {
    createUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
    sendPasswordReset,
    user,
    loading,
    loggedIn: !!user,
    role,
    favJobs,
    setFavJobs,
    approved,
    fetchUser,
  };
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;