import { useState, useMemo, useEffect } from "react";
import DataSorter from "../utils/DataSorter";
import Search from "../utils/Search";
import useFavoriteJob from "../hooks/useFavoriteJobs"
import { AiFillLike } from "react-icons/ai";
import useAuth from "../hooks/useAuth";


export default function JobFinder(){

    const { user } = useAuth(); 

    const { favorites, addToFav, removeFromFav } = useFavoriteJob(); // use custom hook to get the favorites list and functions to add/remove movies from favorites

    // determains what buttons will be present on your device
    let userType = "job_seeker";

    // Number of entries being shown to the user
    const [numShow, setNumShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);


    const [data, setData] = useState(null); // the movie data
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
        fetchData(setData,user)
    }, [user]);



    async function fetchData(setData, user) {
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
    const isFavorite = (jobPosting) => {
        return favorites.some(fav => fav.job_id === jobPosting.job_id);
    }

    const deletePosting = (jobId) => {

    } 
    /*const handleButtonClick(){
        switch(userType){
            case "job_seeker":
                break;
            case "recruiter":
                break;
            case "admin":
                break;
        }
        return;
    };*/

    return(
        <>

        <div className="flex items-center justify-center gap-5">
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
                <div key={index} className="relative card w-full bg-base-100 card-xs shadow-sm">
                  <a href="#" className="hover-3d my-12 mx-2 cursor-pointer z-10 relative">
  
                    {/* content */}
                    <div className="card w-96 secondary-color primary-color bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
                        <div className="card-body">
                        {/* put the title and description of the movie in the cards */}
                        <h2 className="card-title primary-font text-1xl" key={index}>{d.job_title}</h2>
                        <h2 className="card-title primary-font text-1xl"> Salary: {d.salary_range[0]}$-{d.salary_range[1]}$</h2>
                        <h2 className="card-title primary-font text-1xl">{d.location}</h2>
                        <p className="secondary-font text-base">{d.institution}</p>
                        
                        
                        <div className="justify-end card-actions">
                        {userType === "job_seeker" &&(
                        <button className={`text-xl transform transition-transform duration-75 hover:scale-125 hover:cursor-pointer z-30
                        `}
                            >
                            Apply
                        </button>
                        )}
                        <div className="justify-end card-actions">
                          
                        <button className={`text-xl transform transition-transform duration-75 hover:scale-125 hover:cursor-pointer
                        ${isFavorite(d) ? "text-primary hover:text-error" : "hover:text-success"} z-30`}
                            onClick={isFavorite(d) ? () => removeFromFav(d) : () => addToFav(d)}>
                            <AiFillLike />
                        </button>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    {/* 8 empty divs needed for the 3D effect */}
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </a>

                </div>
            ))}
            </ul>
        )}
        <div className="flex justify-center gap-4 mt-6">
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
