/**
 * LoginPage.jsx
 * 
 * Allows the user to login to their account and also choose an account type. Supports Google and email sign in for job seekers and admins;
 * supports email only for recruiters.
 * 
 * @author Izzy Carlson
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import FallbackElement from "../FallbackElement";

import { errorNotify, successNotify } from "../../utils/ToastifyNotifications";
import {
  GoogleAuthProvider,
} from "firebase/auth";
import useAuth from "../../hooks/useAuth";

export default function LoginPage(){
    const navigate = useNavigate(); // used to navigate to a new page after successful login
    const { signInUser, signInWithGoogle, fetchUser } = useAuth(); // get the signInUser method from the useAuth custom hook, which uses firebase authentication to sign the user in.
    const [loginLoading, setLoginLoading] = useState(false); // separate loading to determine if the user is currently being logged in. (this is separate from the loading in useAuth)
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const [accountType, setAccountType] = useState("job_seeker"); // the type of account the user wants to sign in with

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

            errorNotify("Error signing in: " + errorMessage + " Please try again.");
        });
    };

    const handleGoogleSignIn = async () => {
        setLoginLoading(true);

        try {
            const result = await signInWithGoogle();
            const user = result.user;

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
        {!loginLoading && (<div className="flex flex-col items-center justify-center gap-5 p-25 sm:max-w-md lg:max-w-3xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center">
                <h1 className="primary-font text-primary text-4xl">WELCOME BACK</h1>
                <h2 className="secondary-font text-lg">Please enter your credentials to access your account.<br />If you're a recruiter, <b>please use your company's email.</b></h2>
            </div>
            <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 w-full">
                <legend className="fieldset-legend">Login</legend>
                <h2>What type of account do you want to login as?</h2>
                <div className="flex flex-row gap-2 items-center w-full justify-center">
                    <label className="flex items-center gap-2">
                    <input
                    type="radio" name="radio-12" value="job_seeker" checked={accountType === "job_seeker"} onChange={(e) => setAccountType(e.target.value)} defaultChecked
                    className="radio bg-green-100 border-green-300 checked:bg-green-200 checked:text-green-600 checked:border-green-600" /> Job Seeker
                    </label >
                    <label className="flex items-center gap-2">
                    <input
                    type="radio" name="radio-12" value="recruiter" checked={accountType === "recruiter"} onChange={(e) => setAccountType(e.target.value)}
                    className="radio bg-blue-100 border-blue-300 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600" /> Recruiter
                    </label>
                    <label className="flex items-center gap-2">
                    <input
                    type="radio" name="radio-12" value="admin" checked={accountType === "admin"} onChange={(e) => setAccountType(e.target.value)}
                    className="radio bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600" /> Admin
                    </label>
                </div>
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
                {accountType === "recruiter" ? <span /> : <>
                    <p className="secondary-font mt-4 text-center"><i>OR</i></p>
                    <button type="button" className="btn bg-base-100x mt-4" onClick={handleGoogleSignIn}><FcGoogle /> Sign in with Google</button>
                </>}
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