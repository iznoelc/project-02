/**
 * JSDashboard.jsx
 * 
 * Displays jobs the job seeker has applied to. Job seeker can search through or filter applications.
 * 
 * @author Izzy Carlson
 * @author LandonChapin
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DataSorter from "../utils/DataSorter";
import Search from "../utils/SearchAppsFromJobId";

import useAuth from "../hooks/useAuth";


export default function JSDashboard(){
    const { user } = useAuth();
    const navigate = useNavigate();

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
        if (!userApps || userApps.length == 0) return []; // if there is no data, return null for filteredData
        // console.log("SEARCH:", searchType, searchQuery);
        // console.log("FIRST ITEM:", userApps[0]);
        // console.log("userApps:", userApps);
        //     console.log("searchQuery:", searchQuery);
        //     console.log("searchType:", searchType);
        const result = Search(userApps, searchQuery, searchType);
        return Array.isArray(result) ? result : [];
    }, [searchQuery, searchType, userApps]);
      

    /* use useMemo to cache the result of DataSorter (jnside sortedData) that its only updated when its dependencies change. 
       if data, sortType, or ascending are updated, the result of DataSorter will also update to display the 
       new sortedData.
     */ 
    const sortedData = useMemo(() => {
        if (searchQuery && !filteredData.length) return []; // active search with no results → empty
        // if there is no filtered data, just use the normal data list
        if (!filteredData.length){
            console.log("null")
            return DataSorter(sortType, ascending, userApps);
        }
        // otherwise, sort the filtered data
        return DataSorter(sortType, ascending, filteredData);
    }, [filteredData, sortType, ascending, userApps, searchQuery]);

    // fetch applications from database
    useEffect(() => {
        async function fetchApplications() {
          try {
            const res = await fetch (`${import.meta.env.VITE_API_URL}/applications/${user.uid}`, {
                headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
              },
            })
            // const response = await res.text();
            // console.log("RAW RESPONSE APPLICATIONS: " + response);
            if (!res.ok){
              if (res.status === 403){
                navigate("/error", { state: { code: 403 } })
                return;
              }
              throw new Error(`HTTP error! status: ${res.status}`)
            }
            const data = await res.json();
            console.log("RAW APPLICATION:", data.filteredApplications);
            let flattenedData = [];
            if (data.filteredApplications.length > 0){
                console.log("applications[0] id:", data.filteredApplications[0].job_id);
                flattenedData = data.filteredApplications.map(app => (
                
                {
                ...app,
                job_title: app.job_id?.job_title ?? "Deleted Job",
                location: app.job_id?.location ?? "N/A",
                category: app.job_id?.category ?? "N/A",
                salary_range: app.job_id?.salary_range ?? "N/A",
                institution: app.job_id?.institution ?? "N/A",
                date: new Date(app.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                }));

                console.log("FLATTENED:", flattenedData[0].job_title);
                console.log("FLATTENED JOB:", flattenedData[0].job_id);
            }

            setUserApps(flattenedData);
        } catch (error) {
          console.error("Error retrieving application data from the database", error);
        }
      }
        if (user) fetchApplications();
    }, [user]);

    return(
        <>
        <div className="hero bg-base-200 gap-2">
            <div className="hero-content text-center">
                <div className="max-w-2xl">
                    <h1 className="text-5xl">JOB SEEKER DASHBOARD</h1>
                    <p>
                        Dear {user.displayName ? user.displayName : "job seeker"}, welcome to the job seeker dashboard. Here, you can view the jobs you
                        have applied to.
                    </p>
                </div>
            </div>
        </div>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mx-auto p-8 justify-center items-center">
            {sortedData.map((d, index) => (

                <div class="card w-96 bg-base-200 card-md shadow-sm" key={index}>
                <div class="card-body">
                    <h1 class="card-title">{d.job_title}</h1>
                    <div class="badge badge-outline badge-primary">{d.category}</div>
                    <p><b>{d.institution}</b>, {d.location}</p>
                    <p>You applied on {d.date}</p>
                    <div class="justify-end card-actions">
                    {/* <button class="btn btn-primary">More...</button> */}
                    </div>
                </div>
                </div>
            ))}
            </div>
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