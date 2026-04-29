/**
 * HomePage.jsx
 * 
 * The home page displayed when the user first lands on Universal Careers.
 * 
 * @author Izzy Carlson
 */

import HeroImage from "../assets/HeroImage.jpg"

import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();
    const { loggedIn, role, user } = useAuth();

    return (
        <div className="flex flex-col items-center pt-20 h-screen">
            {loggedIn && <><h1 className="mb-5 text-5xl font-bold">Welcome back, <span className="text-primary">{user.displayName}</span>!</h1></>}
            <div
                class="hero sm:min-h-100 lg:min-h-150 mask-[linear-gradient(to_bottom,black_80%,transparent)]"
                style={{backgroundImage: `url(${HeroImage})`}}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-3xl">
                    <h1 className="mb-5 text-5xl font-bold"><span className="text-primary">Your</span> universe of careers.</h1>
                    <p className="mb-5 text-xl">
                        We are dedicated to uplifting our job seekers and recruiters. Universal Careers aims to streamline the job searching and posting
                        process to make it as smooth as possible. We believe in opportunities that are inclusive, collaborative, and 
                        worker-focused. Whether you are a job seeker or a company looking to recruit, <b>blast off today</b> with Universal Careers.
                    </p>
                    {loggedIn ? <button className="btn btn-primary" onClick={() => navigate(
                        role === "admin" ? "/admin-dashboard" :
                        role === "job_seeker" ? "job-seeker-dashboard" :
                        role === "recruiter" ? "recruiter-dashboard" :
                        "/",
                        { replace: true }
                        )}>Dashboard</button>: <button className="btn btn-primary" onClick={() => navigate("/job-seeker-signup", {replace: true})}>Get Started</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}