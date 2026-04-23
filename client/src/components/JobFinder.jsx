import { useState, useMemo, useEffect } from "react";
import DataSorter from "../utils/DataSorter";
import Search from "../utils/Search";
import useFavoriteJob from "../hooks/useFavoriteJobs"
import { FaRegStar, FaStar } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import {deletePosting} from "../utils/DeleteCreateJobInDataBase.js";
import { Link } from "react-router-dom";
import { normalizeId } from "../utils/NormalizeJobId";




export default function JobFinder(){

    const { user, favJobs, role } = useAuth(); 

    const { addToFav, removeFromFav } = useFavoriteJob(); // use custom hook to get the favorites list and functions to add/remove movies from favorites

    // determains what buttons will be present on your device
    let userType = "admin";

    // Number of entries being shown to the user
    const [numShow, setNumShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);


    const [data, setData] = useState(null); // the job data
    const [sortType, setSortType] = useState("Date"); // default sort type
    const [ascending, setAscending] = useState(true); // default sort direction 

    const [searchQuery, setSearchQuery] = useState(""); // default search query - empty string
    const [searchType, setSearchType] = useState("Location"); //default search type

    /* use useMemo to cache the result of Search that its only updated when its dependencies change. 
       if searchQuery, searchType, or data are updated, the result of Search will also update to display the 
       new filteredData.
     */ 
    const filteredData = useMemo(() => {
        if (!data) return []; // if there is no data, return null for filteredData
        return Search(data, searchQuery, searchType);
    }, [searchQuery, searchType, data]);
      

    /* use useMemo to cache the result of DataSorter (jnside sortedData) that its only updated when its dependencies change. 
       if data, sortType, or ascending are updated, the result of DataSorter will also update to display the 
       new sortedData.
     */ 
    const sortedData = useMemo(() => {
        // if there is no filtered data, just use the normal data list
        if (!filteredData){
            console.log("Data is null");
            return DataSorter(sortType, ascending, data);
        }
        // otherwise, sort the filtered data
        return DataSorter(sortType, ascending, filteredData);
    }, [filteredData, sortType, ascending, data]);

        /* use useEffect here to get the data once its loaded from the loader, since it will take some time. */
    useEffect(() => {
        console.log("currentUser:", user);
        if (!user) return;
        fetchData(user)
    }, [user]);



    async function fetchData( user) {
        try {
            const token = await user.getIdToken();

            const res = await fetch("http://localhost:3000/job_postings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log("FETCHED Job Postings:", data);

            setData(data);
        } catch (err) {
            console.error("Failed to fetch Job Postings:", err);
        }
    }

    // check if movie is in favorites list by checking if the title of the movie is in the favorites list. return true if it is, false if it isnt.
    const isFavorite = (jobId) => {
        return favJobs.some(fav => normalizeId(fav) === jobId.toString());
    }


    const handleButtonClick = (job_id) =>{
        switch(userType){
            case "job_seeker":
                break;
            case "recruiter":
                deletePosting(job_id, user, fetchData, confirmToast);
                break;
            case "admin":
                deletePosting(job_id, user, fetchData, confirmToast);
                break;
        }
        return;
    };

    function confirmToast(message = "Are you sure?") {
        return new Promise((resolve) => {
            toast(
                ({ closeToast }) => (
                    <div>
                        <p className="font-bold mb-2">{message}</p>
    
                        <div className="flex gap-2">
                            <button
                                className="btn btn-error btn-sm"
                                onClick={() => {
                                    resolve(true);
                                    closeToast();
                                }}
                            >
                                Yes
                            </button>
    
                            <button
                                className="btn btn-sm"
                                onClick={() => {
                                    resolve(false);
                                    closeToast();
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                ),
                {
                    position: "top-center",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    hideProgressBar: true,
                }
            );
        });
    }

    return(
        <>
        <div className="hero bg-base-200 gap-2">
            <div className="hero-content text-center">
                <div className="max-w-2xl">
                    <h1 className="text-5xl">SEARCH FOR JOBS</h1>
                    <p>
                        Explore jobs here by choosing a filter category and then typing in the search bar. You can also sort by location, category, or salary.
                    </p>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-center gap-5 w-screen">
            {/* search bar */}
            <select onChange={(e) => setSearchType(e.target.value)} className="secondary-font">
                <option value="location">Location</option>
                <option value="category">Category</option>
                <option value="salary">Salary</option>
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
                        <li><a onClick={() => setSortType("Location")}>By Location</a></li>
                        <li><a onClick={() => setSortType("Category")}>By Category</a></li>
                        <li><a onClick={() => setSortType("Salary")}>By Salary</a></li>
                    </ul>
            </div>
            {/* ascending/descending checkbox */}
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-32 border p-4">
                <legend className="fieldset-legend secondary-font">Sorting Options</legend>
                <label className="label secondary-font">
                    <input type="checkbox" defaultChecked className="checkbox" onChange={() => setAscending(!ascending)}/>
                    Ascending Order
                </label>
                <label className="label secondary-font"> Number of Jobs Shown </label>
                  <select
                    value={numShow}
                    className="select"
                    onChange={(e) => {
                      setNumShow(Number(e.target.value));
                      setCurrentPage(0); // reset pagination
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
            </fieldset>
        </div>

        {/* To be displayed if data is not loading and the current data length is bigger than zero */}
        {sortedData.length > 0 && (
            <ul list bg-base-100 rounded-box shadow-md> 

            {sortedData.slice(currentPage * numShow, numShow + (currentPage * numShow) ).map((d, index) => (
                
                <div key={index} className="relative card w-screen bg-base-100 card-xs shadow-sm">
 
  
                    {/* content */}

                    <div className="card-body">
                        <div className="grid grid-cols-2 gap-2 max-w-screen p-8 grid-col-grow">
                            <div className="flex flex-col gap-2">
                                {/* put the title and description of the movie in the cards */}
                                <Link to={`/jobs/${d._id}`} className="no-underline">
                                <h2 className="card-title primary-font text-2xl hover:underline">
                                    {d.job_title}
                                </h2>
                                <h3 className="text-lg">{d.location}</h3>
                                </Link>
                                <h2 className="card-title primary-font text-1xl"> Salary: ${d.salary_range[0]} - ${d.salary_range[1]}</h2>
                                <div className="flex flex-row gap-2">
                                <div class="badge badge-primary">{d.category}</div>
                                <div class="badge badge-outline badge-primary">{d.institution}</div>
                                </div>
                                
                            </div>
                            <div className="justify-end card-actions">
                                <ul list>
                                    
                                    <h2 className="card-title primary-font text-1xl">APPLICATION DEADLINE: {d.deadline}</h2>  
                                    <div>                                              
                                        {role === "job_seeker" &&(
                                            <button className={`text-xl transform transition-transform duration-75 hover:scale-125 hover:cursor-pointer z-30
                                            `}
                                                >
                                                Apply
                                            </button>
                                        )}

                                        {role === "admin" && (
                                            <button
                                                className="text-xl transform transition-transform hover:scale-125"
                                                onClick={() => handleButtonClick(d._id)}
                                            >
                                                Remove Posting
                                            </button>
                                        )}
                                    

                                        <div className="justify-end card-actions">
                                        
                                            <button className={`text-xl transform transition-transform duration-75 hover:scale-125 hover:cursor-pointer
                                            ${isFavorite(d._id) ? "text-primary hover:text-error" : "hover:text-success"} z-30`}
                                                onClick={isFavorite(d._id) ? () => removeFromFav(d.job_title, d._id) : () => addToFav(d.job_title, d._id)}>
                                                {isFavorite(d._id) ? <FaStar /> : <FaRegStar />}
                                            </button>
                                        </div>
                                    </div>   
                                </ul>
                            </div>
                        </div>
                    </div>
                                            

                </div>
            ))}
            </ul>
        )}
        <div className="flex justify-center gap-4 p-8">
          <button
            className="btn"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>

          <span className="secondary-font">
            Page {currentPage + 1}
          </span>

          <button
            className="btn"
            disabled={(currentPage + 1) * numShow >= sortedData.length }
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>

        {/* To be displayed if data is not loading and the current data length is zero (i.e. no search results) */}
        {sortedData.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5 p-16">
                <h1 className="secondary-font text-2xl">No jobs found.</h1>
            </div>
        )}

        </>
    )

}
