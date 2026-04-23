import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import FallbackElement from "../FallbackElement";
import fields from "../../utils/RecruiterSignUpFields.js";
import { createRecruiterInDatabase } from "../../utils/CreateUserInDatabase.js";

import {
  updateProfile,
} from "firebase/auth";

import { errorNotify, successNotify } from "../../utils/ToastifyNotifications.js";

export default function RecruiterSignUpPage(){
    const { createUser, loggedIn, fetchUser } = useAuth(); // get the createUser function from the useAuth hook
    const navigate = useNavigate(); // used to navigate to a new page after successful login
    const [loginLoading, setSignUpLoading] = useState(false); // separate loading to determine if the user is currently being logged in. (this is separate from the loading in useAuth)
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const [msg, setMsg] = useState("");

    // this is the form data that is updated when the user updates one of the fields
    const [formData, setFormData] = useState({
        org_name: "", 
        org_website: "",
        org_location: "",
        email: "",
        password: "",
        role: "recruiter",
        display_name: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents page reload
        console.log("Form Submitted:", formData);
        setSignUpLoading(true);
        
        try {
            const userCredential = await createUser(formData.email, formData.password);
            const user = userCredential.user;
            // create the user in the database

            await updateProfile(user, {
                displayName: formData.display_name,
            });
            
            //createRecruiterInDatabase(user, formData, setSignUpLoading);

            // create the recruiter in the database
            const token = await user.getIdToken();
            const res = await fetch(`http://localhost:3000/users`, {
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    uid: user.uid,
                    display_name: formData.display_name,
                    organization: formData.org_name,
                    location: formData.org_location,
                    website: formData.org_website,
                    role: formData.role,
                }),
            });

            if (!res.ok){ throw new Error({error: "Error posting user to the database."})}
            
            await fetchUser(user.uid, token); // update user in auth provider ASAP
            
            // successful sign up
            console.log(user);
            console.log("loggedIn: " + loggedIn);
            
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

    const handleChange = (event) => {
        // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));
    };

    return(
        <>
        {loginLoading && (<FallbackElement />)}
        {!loginLoading && (<div className="flex flex-col items-center justify-center gap-5 p-25">
            <div className="flex flex-col items-center justify-center">
                <h1 className="primary-font text-primary text-4xl">Create a Recruiter Account</h1>
                <p className="secondary-font">Trying to create a job seeker account? <a href="/job-seeker-signup" className="hover:text-primary text-center"><b>Sign up here instead.</b></a></p>
            </div>
            <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
                <legend className="fieldset-legend">Login</legend>

                <h2 className="text-lg">Recruiter Account Fields</h2>
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
                <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                </p>

                <h2 className="pt-8 text-lg">Your Organization Fields</h2>
                { /* company related input */ }
                {fields.map((field, index) => (
                    <div key={index}>
                        <label className="label">{field.label}</label>
                        <label className="input validator w-xl">
                        <input
                            type={field.type}
                            id={field.id}
                            name={field.name}
                            value={formData[field.name]}
                            required
                            placeholder={field.placeholder}
                            minLength="3"
                            onChange={handleChange}
                        />
                    </label>
                    <p className="validator-hint hidden">{field.validator_hint}</p>
                    </div>
                ))}
                {/* buttons to sign in with email and password or with google */}
                <button type="submit" className="btn btn-primary mt-4">Create Recruiter Account</button>
            </fieldset>
        </form>
        {/* link to sign up page if the user doesnt have an account yet */}
        <div className="flex items-center justify-center gap-5">
            <p className="secondary-font">Already have an account? Login
                <a href="../login" className="hover:text-primary text-center"><b> here.</b></a>
            </p>
        </div>
        </div>)}
        </>
    );
}