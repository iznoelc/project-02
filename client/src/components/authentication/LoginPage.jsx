/** LoginPage.jsx
 *  login page component, which displays a text field for email and password, as well as a button to submit the form and a button to sign in with google.
 *  uses daisyUI form components to make sure a valid password and email are being entered.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import FallbackElement from "../FallbackElement";
import { createJobSeekerInDatabase } from "../../utils/CreateUserInDatabase.js";

import { errorNotify, successNotify } from "../../utils/ToastifyNotifications";
import {
  GoogleAuthProvider,
} from "firebase/auth";
import useAuth from "../../hooks/useAuth";

export default function LoginPage(){
    const navigate = useNavigate(); // used to navigate to a new page after successful login
    const { signInUser, signInWithGoogle } = useAuth(); // get the signInUser method from the useAuth custom hook, which uses firebase authentication to sign the user in.
    const [loginLoading, setLoginLoading] = useState(false); // separate loading to determine if the user is currently being logged in. (this is separate from the loading in useAuth)
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const [msg, setMsg] = useState("");

    // this is the form data that is updated when the user updates one of the fields
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // this updates the form data based on what is being typed into the text fields
    const handleChange = (event) => {
        // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));
    };

    // this is what happens when the user clicks the submit button
    const handleSubmit = (event) => {
        event.preventDefault(); // prevents page reload
        console.log("Form Submitted:", formData); // logs the data entered into the form
        setLoginLoading(true); // sets loading to true when the user clicks the submit button, which will show the loading screen until the login process is complete

                // signs the user in. this method is from the useAuth custom hook, which uses firebase authentication to sign the user in.
        signInUser(formData.email, formData.password)
        .then((userCredential) => {
            // successful sign in
            const user = userCredential.user;
            console.log(user);

            setLoginLoading(false);

            
            successNotify("Successfully signed in!");

            // take the user to the dashboard after they log in
            navigate("/", { replace: true });
        })
        .catch((error) => {
            // unsuccessful sign in, give the user an alert so they know to try again, log errors for debugging.
            //alert("Incorrect email or password. Please try again.");

            setLoginLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("error code: ", errorCode);
            console.log("error message: ", errorMessage);

            setMsg("Error signing in: " + errorMessage + " Please try again.");
            errorNotify(msg);
        });
    };

    const handleGoogleSignIn = async () => {
        setLoginLoading(true);

        try {
            const result = await signInWithGoogle();
            const user = result.user;

            await createJobSeekerInDatabase(user, setLoginLoading, user.displayName, "job_seeker");

            successNotify("Login Successful!");
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error signing in with Google: ", error);
            errorNotify("Error signing in with Google, please try again.");
        } finally {
            setLoginLoading(false);
        }
    }

    
    return(
        <>
        {loginLoading && (<FallbackElement />)}
        {!loginLoading && (<div className="flex flex-col items-center justify-center gap-5 p-10">
            <div className="flex flex-col items-center justify-center">
                <h1 className="primary-font text-primary text-4xl">Welcome Back!</h1>
                <h2 className="secondary-font text-lg">Please enter your credentials to access your account.<br />If you're a recruiter, <b>please use your company's email.</b></h2>
            </div>
            <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
                <legend className="fieldset-legend">Login</legend>

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
                        onChange={handleChange}
                    />
                    <i className="hover: cursor-pointer" onClick={() => setPasswordVisibility(!passwordVisibility)}>
                        {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                    </i>
                </label>
                <p className="text-right hover:cursor-pointer hover:text-primary" onClick={() => navigate("/forgot-password")}>Forgot Password?</p>
                {/* buttons to sign in with email and password or with google */}
                <button type="submit" className="btn btn-primary mt-4">Login</button>
                <p className="secondary-font mt-4 text-center"><i>OR</i></p>
                <button type="button" className="btn bg-base-100x mt-4" onClick={handleGoogleSignIn}><FcGoogle /> Sign in with Google</button>
            </fieldset>
        </form>
        {/* link to sign up page if the user doesnt have an account yet */}
        <div className="flex items-center justify-center gap-5">
            <p className="secondary-font">New around here? Create a 
                <a href="../job-seeker-signup" className="hover:text-primary text-center"><b> Job Seeker </b></a>
                or 
                <a href="../recruiter-signup" className="hover:text-primary text-center"><b> Recruiter </b></a>
                account today!
            </p>
        </div>
        </div>)}
        </>
    );
}