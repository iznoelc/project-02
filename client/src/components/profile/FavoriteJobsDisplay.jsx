/**
 * FavoriteJobsDisplay.jsx
 * 
 * Display's a job seeker's favorite jobs on their profile using profile information.
 * 
 * @author Izzy Carlson
 */

import { IoCloseSharp } from "react-icons/io5";
import useFavoriteJob from "../../hooks/useFavoriteJobs";
import useAuth from "../../hooks/useAuth";

export default function FavoriteJobsDisplay({profile, isOwnProfile}){
    const { removeFromFav } = useFavoriteJob();
    const { favJobs } = useAuth();
    console.log("Profile from fav jobs ", profile);
    console.log("favJobs from context:", favJobs);

    return ( 
        <>   
        {isOwnProfile && (
            <div className="flex flex-col items-center">
            <h1 className="text-4xl">YOUR FAVORITE JOBS</h1>
            {favJobs.length > 0 && (
                <>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-2">
                {favJobs.map((j, index) => (
                <div class="card w-96 bg-base-100 card-sm shadow-sm">
                <div class="card-body" key={index}>
                        <h2 class="card-title">{j.job_title}</h2>
                        <p>Deadline: {j.deadline}</p>
                        <div class="justify-end card-actions">
                        <button className="hover:cursor-pointer text-4xl hover:text-red-600" onClick={() => removeFromFav(j.job_title, j._id)}><IoCloseSharp /></button>
                        </div>
                    </div>
                </div>
                ))}
                </div>
                </>
            )}
            {favJobs.length === 0 && (
                <p>No favorite jobs yet.</p>
            )}
        </div>
        )}
        </>
    )
}