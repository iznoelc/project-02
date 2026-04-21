import { useNavigate } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function NavBar(){
    const { loggedIn, signOutUser, role, user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
        {/* nav bar for when the user is logged out */}
        {!loggedIn && (<>
        <div className="navbar bg-base-200 shadow-sm fixed top-0 z-50 w-full">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                </div>
                <h1 className="btn btn-ghost hover:cursor-pointer text-2xl" onClick={() => navigate("/", { replace: true})}>UNIVERSAL CAREERS</h1>
            </div>
            <div className="navbar-center hidden lg:flex">
            </div>
            <div className="navbar-end gap-2">
                <button className="btn" onClick={() => navigate("/login")}>Login</button>
                <button className="btn btn-primary" onClick={() => navigate("/job-seeker-signup")}>Get Started</button>
            </div>
            </div>

        </>)}

        {/* nav bar for when the user is logged in */}
        {loggedIn && (<>
        <div className="navbar bg-base-200 shadow-sm">
            <div className="navbar-start">
                <h1 className="btn btn-ghost hover:cursor-pointer text-2xl" onClick={() => navigate("/", { replace: true})}>UNIVERSAL CAREERS</h1>
            </div>
            <div className="flex navbar-center">
                <ul className="menu menu-horizontal px-1">
                <button className="btn" onClick={() => navigate("/")}> <GoHomeFill /> </button>
                <button className="btn" onClick={() => navigate("/search")}> <FaSearch /> Search Jobs </button>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="text-3xl btn btn-ghost btn-circle avatar">
                    <IoPersonCircle />
                </div>
                <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li><a className="justify-between" onClick={() => navigate(`/profile/${user.uid}`, { replace : true })}>
                        Profile
                    </a></li>
                    <li><a onClick={() => navigate(
                        role === "admin" ? "/admin-dashboard" :
                        role === "job_seeker" ? "job-seeker-dashboard" :
                        role === "recruiter" ? "recruiter-dashboard" :
                        "/",
                        { replace: true }
                        )}>
                            Dashboard
                    </a></li>
                    <li><a onClick={signOutUser}>Logout</a></li>
                </ul>
                </div>
            </div>
        </div>
        </div>
    </>
    )}
    </>
     )
}