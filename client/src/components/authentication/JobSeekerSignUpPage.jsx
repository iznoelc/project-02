/**
 * JobSeekerSignUpPage.jsx
 * 
 * Signs up a job seeker account in both Firebase and the Database.
 * 
 * @author Izzy Carlson
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { errorNotify, successNotify } from "../../utils/ToastifyNotifications";

import {
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import useAuth from "../../hooks/useAuth";

import FallbackElement from "../FallbackElement";

export default function JobSeekerSignUpPage(){
    const navigate = useNavigate();

    const { signInWithGoogle, createUser, loggedIn, fetchUser } = useAuth();
    const [msg, setMsg] = useState("Error signing up. Please try again.");

    const [signUpLoading, setSignUpLoading] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    // this is the form data submitted when the user hits the sign up button
    const [formData, setFormData] = useState({
        display_name: "",
        email: "",
        password: "",
        role: "job_seeker",
    });

    
    // this is the method called when the user types into one of the text fields
    const handleChange = (event) => {
        // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));
    };

    // this is called when user hits the sign up button
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents page reload
        console.log("Form Submitted:", formData);
        setSignUpLoading(true);

        try {
            const userCredential = await createUser(formData.email, formData.password);

            // successful sign up (userCredential from firebase)
            const user = userCredential.user;
            console.log(user);
            console.log("loggedIn: " + loggedIn);

            // ensures display name is updated in firebase right away
            await updateProfile(user, {
                displayName: formData.display_name,
            });

            // POST to create the user in DB first 
            const token = await user.getIdToken();
            await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                uid: user.uid,
                display_name: formData.display_name,
                role: "job_seeker",
            }),
            });

            await fetchUser(user.uid, token); // update user in auth provider ASAP

            setSignUpLoading(false);
            successNotify("Account created successfully! You are now logged in.");
            navigate("/", { replace: true });
        } catch (error) {
            // give the user an alert if sign up was unsuccessful and log errors for debugging
            
            setSignUpLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error code: ", errorCode);
            console.log("error message: ", errorMessage);
            setMsg("Error signing up, please try again.");
            errorNotify(msg);
        };
        
    };

    const handleGoogleSignUp = async () => {
        setSignUpLoading(true);

        try {
            const result = await signInWithGoogle();
            const user = result.user;

            // await createJobSeekerInDatabase(user, setSignUpLoading, user.displayName, "job_seeker");
            //create the user in the database
            const token = await user.getIdToken();
            await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                uid: user.uid,
                display_name: user.displayName,
                role: "job_seeker",
            }),
            });
            
            await fetchUser(user.uid, token); // update user in auth provider ASAP
            successNotify("Account created successfully! You are now logged in.");
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error signing in with Google: ", error);
            errorNotify("Error signing in with Google, please try again.");
        } finally {
            setSignUpLoading(false);
        }
    }

    

    return (
        <>
        {signUpLoading && (<FallbackElement />)}
        {!signUpLoading && (
            <div className="flex flex-col items-center justify-center gap-5 p-25">
            {/*imghere*/}
            <h1 className="primary-font text-primary text-4xl">CREATE A JOB SEEKER ACCOUNT</h1>
            <p className="secondary-font">Trying to create an recruiter account? <a href="/recruiter-signup" className="hover:text-primary text-center"><b>Sign up here instead.</b></a></p>
            <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
                <legend className="fieldset-legend">Sign Up</legend>

                {/* display_name input */}
                <label className="label">Enter Display Name</label>
                <label className="input validator w-xl">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        </g>
                    </svg>
                    <input
                        type="text"
                        id="display_name"
                        name="display_name"
                        value={formData.display_name}
                        onChange={handleChange}
                        required
                        placeholder="Display Name"
                        pattern="[A-Za-z][A-Za-z0-9\-]*"
                        minLength="3"
                        maxLength="30"
                        title="Only letters, numbers or dash"
                    />
                </label>
                <p className="validator-hint hidden">
                    Must be 3 to 30 characters
                    <br />containing only letters, numbers or dash
                </p>

                {/* email address input */}
                <label className="label">Enter Email Address</label>
                <label className="input validator w-xl">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="gleebus@glorpmail.com"
                    />
                </label>
                <div className="validator-hint hidden">Enter valid email address</div>

                { /* password input */}
                <label className="label">Enter Password</label>
                <label className="input validator w-xl">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <path
                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                        ></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        </g>
                    </svg>
                    <input
                        type={passwordVisibility ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        required
                        placeholder="Password"
                        minLength="8"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        onChange={handleChange}
                    />
                    <i className="hover: cursor-pointer" onClick={() => setPasswordVisibility(!passwordVisibility)}>
                        {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                    </i>
                </label>
                <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                </p>
                {/* buttons to sign up with email and password or google */}
                <button type="submit" className="btn btn-primary mt-4">Create Account and Login</button>
                <p className="secondary-font mt-4 text-center"><i>OR</i></p>
                <button type="button" className="btn bg-base-100x mt-4" onClick={handleGoogleSignUp}><FcGoogle /> Sign up with Google</button>
            </fieldset>
        </form>
        {/* redirect to sign in if the user already has an account */}
        <div className="flex items-center justify-center gap-5">
            <p className="secondary-font">Already joined? <a href="/login" className="hover:text-primary text-center">Login Here.</a></p>
        </div>
        </div>
        )}
        </>
    );
}