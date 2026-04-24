import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { errorNotify, successNotify } from "../../utils/ToastifyNotifications";

export default function ForgotPasswordPage(){
    const { sendPasswordReset } = useAuth();     

    // use form data here, dynamic in case we want to add more verification to reset your password in the future
    const [formData, setFormData] = useState({
        email: ""
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

    /**
     * Sends a password reset email to the entered email using Firebase when the submit button is clicked.
     * @param {} event 
     */
    const handleSubmit = (event) => {
        event.preventDefault(); // prevents page reload
        console.log("Form Submitted:", formData); // logs the data entered into the form

        sendPasswordReset(formData.email)
          .then(() => {
            successNotify("Password reset email sent!");
        })
        .catch((error) => {
            errorNotify("There was an error when trying to send the password reset email. Please try again.");

            const errorCode = error.code;
            
            const errorMessage = error.message;

            console.log(errorCode, errorMessage);
            // ..
        });
    }

    return (
        <>
        <div className="flex flex-col items-center justify-center gap-5 p-10 pt-25">
            <h1 className="text-3xl text-primary">FORGOT YOUR PASSWORD?</h1>
            <h3 className="text-xl">No worries! Enter your email and, if it exists, we'll send you an email to reset.</h3>
            <form className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
            <legend className="fieldset-legend">Recover your account</legend>

            <label className="label">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="input w-full"
                placeholder="Email"
                onChange={handleChange}
            />

            <button type="submit" className="btn btn-neutral mt-4" onClick={handleSubmit}>Login</button>
            </form>
        </div>
        </>
    );
}