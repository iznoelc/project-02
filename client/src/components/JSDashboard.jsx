import { useState, useMemo, useEffect } from "react";
import DataSorter from "../utils/DataSorter";
import Search from "../utils/SearchAppsFromJobId";

import useAuth from "../hooks/useAuth";

export default function JSDashboard(){
    const { user } = useAuth();

    // const jobsAppliedTo = jobPostings;//useLoaderData(); // get the data from the dashboard loader in MainRouter using useLoaderData
    const [userApps, setUserApps] = useState([]);

    const [sortType, setSortType] = useState("Category"); // default sort type
    const [ascending, setAscending] = useState(true); // default sort direction 

    const [searchQuery, setSearchQuery] = useState(""); // default search query - empty string
    const [searchType, setSearchType] = useState("location"); //default search type

    /* use useMemo to cache the result of Search that its only updated when its dependencies change. 
       if searchQuery, searchType, or data are updated, the result of Search will also update to display the 
       new filteredData.
     */ 
    const filteredData = useMemo(() => {
        if (!userApps) return []; // if there is no data, return null for filteredData
        console.log("SEARCH:", searchType, searchQuery);
        console.log("FIRST ITEM:", userApps[0]);
        console.log("userApps:", userApps);
            console.log("searchQuery:", searchQuery);
            console.log("searchType:", searchType);
        const result = Search(userApps, searchQuery, searchType);
        return Array.isArray(result) ? result : [];
    }, [searchQuery, searchType, userApps]);
      

    /* use useMemo to cache the result of DataSorter (jnside sortedData) that its only updated when its dependencies change. 
       if data, sortType, or ascending are updated, the result of DataSorter will also update to display the 
       new sortedData.
     */ 
    const sortedData = useMemo(() => {
        // if there is no filtered data, just use the normal data list
        if (!filteredData.length){
            console.log("null")
            return DataSorter(sortType, ascending, userApps);
        }
        // otherwise, sort the filtered data
        return DataSorter(sortType, ascending, filteredData);
    }, [filteredData, sortType, ascending, userApps]);

    // fetch applications from database
    useEffect(() => {
        async function fetchApplications() {
          try {
            const res = await fetch (`http://localhost:3000/applications/${user.uid}`, {
                headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
              },
            })
            // const response = await res.text();
            // console.log("RAW RESPONSE APPLICATIONS: " + response);

            const data = await res.json();

            const flattenedData = data.applications.map(app => ({
              ...app,
              job_title: app.job_id.job_title,
              location: app.job_id.location,
              category: app.job_id.category,
              salary_range: app.job_id.salary_range
            }));

            setUserApps(flattenedData);
        } catch (error) {
          console.error("Error retrieving application data from the database", error);
        }
      }
        if (user) fetchApplications();
    }, [user]);

    return(
        <>

        <div className="flex items-center justify-center gap-5">
            {/* search bar */}
            <select onChange={(e) => setSearchType(e.target.value)} className="secondary-font">
                <option value="location">Location</option>
                <option value="category">Category</option>
                <option value = "job_title">Job Title</option>
            </select>
            <label className="input input-bordered input-m w-lg">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input type="search" required placeholder="Search for jobs..." onChange={(e) => setSearchQuery(e.target.value)}/>
            </label>
            {/* drop down menu for search type */}
            <div className="dropdown dropdown-hover">
                <div tabIndex="0" role="button" className="btn m-1 secondary-font">SORT...</div>
                    <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-lg">
                        <li><a onClick={() => setSortType("createdAt")}>By Application Date</a></li>
                    </ul>
            </div>
            {/* ascending/descending checkbox */}
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-32 border p-4">
                <legend className="fieldset-legend secondary-font">Sorting Options</legend>
                <label className="label secondary-font">
                    <input type="checkbox" defaultChecked className="checkbox" onChange={() => setAscending(!ascending)}/>
                    Ascending Order
                </label>
            </fieldset>
        </div>

        {/* To be displayed if data is not loading and the current data length is bigger than zero */}
        {sortedData.length > 0 && (
            <ul list bg-base-100 rounded-box shadow-md> 

            {sortedData.map((d, index) => (
                <div key={index} className="card w-full bg-base-100 card-xs shadow-sm">
                    <div className="card-body">
                        {/* put the title and description of the movie in the cards */}
                        <h2 className="card-title primary-font text-1xl" key={index}>{d.job_title}</h2>
                        <h2 className="card-title primary-font text-1xl"> Salary: ${d.salary_range[0]} to ${d.salary_range[1]}</h2>
                        <h2 className="card-title primary-font text-1xl">{d.location}</h2>
                        <p className="secondary-font text-base">{d.category}</p>
                        <p className="secondary-font text-base">{d.institution}</p>
                        

                        <div className="justify-end card-actions">
                        <button className={`text-xl transform transition-transform duration-75 hover:scale-125 hover:cursor-pointer
                        `}
                            >
                            
                        </button>
                        </div>
                    </div>
                </div>
            ))}
            </ul>
        )}
        {/* To be displayed if data is not loading and the current data length is zero (i.e. no search results) */}
        {sortedData.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5 p-16">
                <h1 className="secondary-font text-2xl">No jobs found.</h1>
            </div>
        )}
        </>
        
    )
}