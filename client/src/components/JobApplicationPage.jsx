import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";


export default function JobApplicationPage({job}){

    const { user } = useAuth(); 

    const [data, setData] = useState(null); // the job application data


    let job_id = job._id

    async function fetchData( user) {
        try {
            const token = await user.getIdToken();

            const res = await fetch("http://localhost:3000/applications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const rawData = await res.json();
            console.log("FETCHED Job Applications:", data);

            const filtered = filterData(rawData);
            setData(filtered);

        } catch (err) {
            console.error("Failed to fetch Job Applications:", err);
        }
    }

            /* use useEffect here to get the data once its loaded from the loader, since it will take some time. */
    useEffect(() => {
        console.log("currentUser:", user);
        if (!user) return;
        fetchData(user)
    }, [user]);


    const filterData = (applications) => {
    return applications.filter(app => app.job_id === job_id);
    };




    return(
        <div>
            <h1> {job.job_title} Applications </h1>

        {/* To be displayed if data is not loading and the current data length is bigger than zero */}
        {data.length > 0 && (
            <ul list bg-base-100 rounded-box shadow-md> 

            {data.map((d, index) => (
                <div key={index} className="relative card w-full bg-base-100 card-xs shadow-sm">
 
  
                    {/* content */}

                    <div className="card-body">
                        <div className="grid grid-cols-2  gap-200 mx-auto p-8 grid-col-grow">
                            <div>
                                {/* put the details of each job applications in the cards */}
                                
                                <h2 className="card-title primary-font text-1xl"> Applicant: {d.applicant_id} </h2>
                                <h2 className="card-title primary-font text-1xl"> Resume Link{d.resume_link} </h2>
                                <p className="secondary-font text-base"> Cover Letter {d.cover_letter} </p>
                                
                            </div>
                     
                        </div>
                    </div>
                                            

                </div>
            ))}
            </ul>            

        )}

        </div>
    )
}