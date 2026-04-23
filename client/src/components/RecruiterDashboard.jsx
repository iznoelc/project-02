import { useState, useMemo, useEffect } from "react";
import DataSorter from "../utils/DataSorter";
import Search from "../utils/Search";
import useAuth from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import { errorNotify, successNotify } from "../utils/ToastifyNotifications";
import {deletePosting, createPosting } from "../utils/DeleteCreateJobInDataBase.js";
import { Link } from "react-router-dom";


export default function RecuiterDashboard(){

    const { user } = useAuth(); 
    const userCompany = "Nasa"
    const userID = user.uid;

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

    const [formData, setFormData] = useState({
    job_title: "",
    institution: userCompany,
    category: "",
    location: "",
    salary_range: [],
    description: "",
    req_qualifications: [],
    deadline: "", //YYYY-MM-DD
    start_date: "", //YYYY-MM-DD
    recruiter_id: userID
    });

  //Handles all edits to the form data
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handles edits to the salary
  const handleSalaryChange = (index, value) => {
    setFormData(prev => {
      const updatedSalary = [...prev.salary_range];
      updatedSalary[index] = Number(value);

      return {
        ...prev,
        salary_range: updatedSalary,
      };
    });
  };
  // Handles changes to the qualifications for the job
  const handleQualificationsChange = (e) => {
    const value = e.target.value;

    setFormData(prev => ({
      ...prev,
      req_qualifications: value
        .split(",")
        .map(q => q.trim())
        .filter(Boolean),
    }));
  };



  const addJob = async () => {

    const {
      job_title,
      institution,
      category,
      location,
      salary_range,
      description,
      req_qualifications,
      deadline,
      start_date,
      recruiter_id
    } = formData;

    // Basic validation
    if (!recruiter_id){
      errorNotify("Recruiter id is not valid: " + recruiter_id)
    }
    if (
      !job_title.trim() ||
      !institution.trim() ||
      !deadline
    ) {
      errorNotify("Job title, institution, and deadline are required.");
      return;
    }

    // Duplicate check
    const alreadyExists = data.some(job => {
      return (
        job.job_title.toLowerCase() === job_title.trim().toLowerCase() &&
        job.institution.toLowerCase() === institution.trim().toLowerCase() &&
        job.deadline === deadline
      );
    });

    if (alreadyExists) {
      errorNotify("This job posting already exists.");
      return;
    }
    
    if (new Date(deadline) < new Date()) {
      errorNotify("Deadline cannot be in the past.");
      return;
    }


    createPosting(user, fetchData, formData)

    // Reset form
    setFormData({
      job_title: "",
      institution: userCompany,
      category: "",
      location: "",
      salary_range: [],
      description: "",
      req_qualifications: [],
      deadline: "",
      start_date: "",
      recruiter_id: userID
    });
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
        
        <div > 
            <div>
            <div className="flex items-center justify-front gap-5">
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
            </fieldset>
              <list>
              {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md xl:btn-xl" onClick={()=>document.getElementById('my_modal_1').showModal()}>Create New Job Posting</button>
                <a href="/search" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md xl:btn-xl">Search All Jobs</a>
              </list>
        </div>

        {/* To be displayed if data is not loading and the current data length is bigger than zero */}
        {sortedData.length > 0 && (
            <ul list bg-base-100 rounded-box shadow-md justify-end> 

            {sortedData.filter(data => data.institution.toLowerCase() == (userCompany.toLowerCase())).map((d, index) => (
                <div key={index} className="card w-full bg-base-100 card-xs shadow-sm">
                    <div className="card-body">
                        {/* put the title and description of the movie in the cards */}
                        <h2 className="card-title primary-font text-1xl" key={index}>{d.job_title}</h2>
                        <h2 className="card-title primary-font text-1xl"> Salary: ${d.salary_range[0]}- ${d.salary_range[1]}</h2>
                        <h2 className="card-title primary-font text-1xl">{d.location}</h2>
                        <p className="secondary-font text-base">Deadline: {d.deadline}</p>
                        

                        <div className="justify-end card-actions">
                                <Link to={`/job_postings/${d._id}/applications`} className="no-underline">
                                <h2 className="card-title primary-font text-1xl hover:underline">
                                    Review Applications
                                </h2>
                                </Link>
                            <button className="btn btn-xs sm:btn-sm md:btn-sm lg:btn-sm xl:btn-xl" 
                                onClick={() => deletePosting(d._id, user, fetchData, confirmToast)}>
                                Remove Posting
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
        </div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Create New Job Posting
            </h3>

            {/* Job Title */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Job Title</legend>
              <input
                type="text"
                className="input w-full"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
              />
            </fieldset>

            {/* Category */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Category</legend>
              <input
                type="text"
                className="input w-full"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </fieldset>

            {/* Location */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Location</legend>
              <input
                type="text"
                className="input w-full"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </fieldset>

            {/* Salary Range */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Salary Range</legend>
              <div className="flex gap-3">
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Min"
                  value={formData.salary_range[0] || ""}
                  onChange={e => handleSalaryChange(0, e.target.value)}
                />
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Max"
                  value={formData.salary_range[1] || ""}
                  onChange={e => handleSalaryChange(1, e.target.value)}
                />
              </div>
            </fieldset>

            {/* Description */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Description</legend>
              <textarea
                className="textarea w-full"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </fieldset>

            {/* Qualifications */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Required Qualifications (comma separated)
              </legend>
              <input
                type="text"
                className="input w-full"
                onChange={handleQualificationsChange}
                placeholder=""
              />
            </fieldset>

            {/* Deadline */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Application Deadline</legend>
              <input
                type="date"
                className="input w-full"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </fieldset>

            {/* Start Date */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Start Date</legend>
              <input
                type="date"
                className="input w-full"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </fieldset>

            {/* Actions */}
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={addJob}
              >
                Create Job
              </button>

              <form method="dialog">
                <button className="btn">Cancel</button>
              </form>
            </div>
          </div>
        </dialog>



        </div>
        </>

    )
}

