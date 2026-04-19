import { useState, useMemo, useEffect } from "react";
import DataSorter from "../utils/DataSorter";
import Search from "../utils/SearchAppsFromJobId";

import useAuth from "../hooks/useAuth";

export default function JSDashboard(){
    const { user } = useAuth();

    // const jobsAppliedTo = jobPostings;//useLoaderData(); // get the data from the dashboard loader in MainRouter using useLoaderData
    const [userApps, setUserApps] = useState([]);

    const [data, setData] = useState([]); // the movie data
    const [sortType, setSortType] = useState("Category"); // default sort type
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
        if (userApps) {
            setData(userApps);
        }
    }, [userApps]);

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
                        {/* <h2 className="card-title primary-font text-1xl" key={index}>{d.job_title}</h2>
                        <h2 className="card-title primary-font text-1xl"> Salary: {d.salary_range[0]}$-{d.salary_range[1]}$</h2>
                        <h2 className="card-title primary-font text-1xl">{d.location}</h2>
                        <p className="secondary-font text-base">{d.institution}</p> */}
                        {d.createdAt}
                        

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

// const jobPostings = [
//   {
//     job_title: "Software Engineer",
//     job_id: "JOB-1001",
//     institution: "Google",
//     category: "Engineering",
//     location: "Mountain View, CA",
//     salary_range: [110000, 165000],
//     description: "Build scalable web services used by millions of users.",
//     "req-qualifications": ["Bachelor’s degree", "JavaScript experience", "API development"],
//     deadline: "2026-06-01",
//     start_date: "2026-08-01",
//     recruiter_id: "REC-101"
//   },
//   {
//     job_title: "Data Scientist",
//     job_id: "JOB-1002",
//     institution: "Amazon",
//     category: "Data & Analytics",
//     location: "Seattle, WA",
//     salary_range: [120000, 175000],
//     description: "Analyze large datasets to support business decisions.",
//     "req-qualifications": ["Python", "SQL", "Machine learning knowledge"],
//     deadline: "2026-05-20",
//     start_date: "2026-07-15",
//     recruiter_id: "REC-102"
//   },
//   {
//     job_title: "Astronaut",
//     job_id: "JOB-1003",
//     institution: "NASA",
//     category: "Mission Specialist",
//     location: "United States",
//     salary_range: [90000, 150000],
//     description: "Assist in space missions and scientific experimentation.",
//     "req-qualifications": ["STEM degree", "Physical fitness", "Team experience"],
//     deadline: "2026-07-01",
//     start_date: "2026-09-01",
//     recruiter_id: "REC-103"
//   },
//   {
//     job_title: "Cybersecurity Analyst",
//     job_id: "JOB-1004",
//     institution: "Department of Defense",
//     category: "Security",
//     location: "Arlington, VA",
//     salary_range: [95000, 145000],
//     description: "Protect systems from cyber threats and vulnerabilities.",
//     "req-qualifications": ["Security certification", "Incident response", "Risk assessment"],
//     deadline: "2026-06-15",
//     start_date: "2026-08-01",
//     recruiter_id: "REC-104"
//   },
//   {
//     job_title: "AI Research Assistant",
//     job_id: "JOB-1005",
//     institution: "MIT Media Lab",
//     category: "Artificial Intelligence",
//     location: "Cambridge, MA",
//     salary_range: [75000, 115000],
//     description: "Support research in machine learning and human-AI interaction.",
//     "req-qualifications": ["Master’s degree", "Python", "Neural networks"],
//     deadline: "2026-05-31",
//     start_date: "2026-08-20",
//     recruiter_id: "REC-105"
//   },
//   {
//     job_title: "Cloud Architect",
//     job_id: "JOB-1006",
//     institution: "Microsoft",
//     category: "Cloud Computing",
//     location: "Redmond, WA",
//     salary_range: [130000, 185000],
//     description: "Design and maintain cloud infrastructure solutions.",
//     "req-qualifications": ["Azure experience", "Distributed systems", "DevOps knowledge"],
//     deadline: "2026-06-10",
//     start_date: "2026-08-15",
//     recruiter_id: "REC-106"
//   },
//   {
//     job_title: "Mechanical Engineer",
//     job_id: "JOB-1007",
//     institution: "Lockheed Martin",
//     category: "Engineering",
//     location: "Orlando, FL",
//     salary_range: [80000, 120000],
//     description: "Develop mechanical systems for aerospace applications.",
//     "req-qualifications": ["Mechanical engineering degree", "CAD skills", "Problem solving"],
//     deadline: "2026-06-30",
//     start_date: "2026-09-01",
//     recruiter_id: "REC-107"
//   },
//   {
//     job_title: "Urban Planner",
//     job_id: "JOB-1008",
//     institution: "City of Austin",
//     category: "Public Infrastructure",
//     location: "Austin, TX",
//     salary_range: [65000, 95000],
//     description: "Plan sustainable urban development projects.",
//     "req-qualifications": ["Urban planning degree", "GIS experience", "Policy knowledge"],
//     deadline: "2026-07-05",
//     start_date: "2026-09-15",
//     recruiter_id: "REC-108"
//   },
//   {
//     job_title: "Robotics Engineer",
//     job_id: "JOB-1009",
//     institution: "Boston Dynamics",
//     category: "Robotics",
//     location: "Waltham, MA",
//     salary_range: [105000, 155000],
//     description: "Design and test robotic systems.",
//     "req-qualifications": ["Robotics experience", "Control systems", "C++"],
//     deadline: "2026-06-18",
//     start_date: "2026-08-10",
//     recruiter_id: "REC-109"
//   },
//   {
//     job_title: "Biomedical Researcher",
//     job_id: "JOB-1010",
//     institution: "Johns Hopkins University",
//     category: "Healthcare Research",
//     location: "Baltimore, MD",
//     salary_range: [70000, 110000],
//     description: "Conduct biomedical experiments and clinical studies.",
//     "req-qualifications": ["Biology degree", "Lab experience", "Data analysis"],
//     deadline: "2026-05-25",
//     start_date: "2026-07-01",
//     recruiter_id: "REC-110"
//   },

//   /* ---- continuing with more for testing ---- */

//   {
//     job_title: "Front-End Developer",
//     job_id: "JOB-1011",
//     institution: "Netflix",
//     category: "Web Development",
//     location: "Los Angeles, CA",
//     salary_range: [100000, 150000],
//     description: "Build engaging user interfaces for streaming platforms.",
//     "req-qualifications": ["React", "CSS", "Web performance"],
//     deadline: "2026-06-12",
//     start_date: "2026-08-01",
//     recruiter_id: "REC-111"
//   },
//   {
//     job_title: "Systems Analyst",
//     job_id: "JOB-1012",
//     institution: "IBM",
//     category: "Information Systems",
//     location: "Remote",
//     salary_range: [85000, 125000],
//     description: "Analyze and improve enterprise systems.",
//     "req-qualifications": ["Systems analysis", "Documentation", "Stakeholder communication"],
//     deadline: "2026-06-20",
//     start_date: "2026-08-15",
//     recruiter_id: "REC-112"
//   },
//   {
//     job_title: "Environmental Scientist",
//     job_id: "JOB-1013",
//     institution: "NOAA",
//     category: "Environmental Science",
//     location: "Boulder, CO",
//     salary_range: [70000, 105000],
//     description: "Study environmental systems and climate patterns.",
//     "req-qualifications": ["Environmental science degree", "Field research", "Data modeling"],
//     deadline: "2026-06-28",
//     start_date: "2026-09-01",
//     recruiter_id: "REC-113"
//   },
//   {
//     job_title: "Product Manager",
//     job_id: "JOB-1014",
//     institution: "Meta",
//     category: "Product",
//     location: "Menlo Park, CA",
//     salary_range: [120000, 175000],
//     description: "Lead product strategy and cross-functional teams.",
//     "req-qualifications": ["Product management experience", "Roadmapping", "Leadership"],
//     deadline: "2026-06-05",
//     start_date: "2026-08-01",
//     recruiter_id: "REC-114"
//   },
//   {
//     job_title: "Network Engineer",
//     job_id: "JOB-1015",
//     institution: "Cisco",
//     category: "Networking",
//     location: "San Jose, CA",
//     salary_range: [95000, 140000],
//     description: "Maintain and optimize enterprise networks.",
//     "req-qualifications": ["Networking protocols", "Routing", "Switching"],
//     deadline: "2026-06-22",
//     start_date: "2026-08-20",
//     recruiter_id: "REC-115"
//   },
  
// {
//   job_title: "Backend Engineer",
//   job_id: "JOB-1016",
//   institution: "Stripe",
//   category: "Engineering",
//   location: "Remote",
//   salary_range: [115000, 160000],
//   description: "Design and maintain high-scale backend services.",
//   "req-qualifications": ["Node.js", "Databases", "API design"],
//   deadline: "2026-06-18",
//   start_date: "2026-08-10",
//   recruiter_id: "REC-116"
// },
// {
//   job_title: "DevOps Engineer",
//   job_id: "JOB-1017",
//   institution: "GitHub",
//   category: "Infrastructure",
//   location: "Remote",
//   salary_range: [120000, 170000],
//   description: "Improve CI/CD pipelines and platform reliability.",
//   "req-qualifications": ["Linux", "Kubernetes", "Automation"],
//   deadline: "2026-06-20",
//   start_date: "2026-08-14",
//   recruiter_id: "REC-117"
// },
// {
//   job_title: "UX Designer",
//   job_id: "JOB-1018",
//   institution: "Adobe",
//   category: "Design",
//   location: "San Jose, CA",
//   salary_range: [90000, 135000],
//   description: "Design intuitive user experiences for creative tools.",
//   "req-qualifications": ["UX research", "Wireframing", "Prototyping"],
//   deadline: "2026-06-25",
//   start_date: "2026-08-20",
//   recruiter_id: "REC-118"
// },
// {
//   job_title: "Site Reliability Engineer",
//   job_id: "JOB-1019",
//   institution: "Dropbox",
//   category: "Reliability",
//   location: "Remote",
//   salary_range: [125000, 180000],
//   description: "Maintain uptime and reliability for large-scale systems.",
//   "req-qualifications": ["Monitoring", "Incident response", "Cloud systems"],
//   deadline: "2026-06-15",
//   start_date: "2026-08-01",
//   recruiter_id: "REC-119"
// },
// {
//   job_title: "QA Automation Engineer",
//   job_id: "JOB-1020",
//   institution: "Zoom",
//   category: "Quality Assurance",
//   location: "San Jose, CA",
//   salary_range: [85000, 115000],
//   description: "Develop automated tests to ensure product quality.",
//   "req-qualifications": ["Test automation", "Selenium", "CI tools"],
//   deadline: "2026-06-22",
//   start_date: "2026-08-18",
//   recruiter_id: "REC-120"
// },

// /* ---------- trimmed comment: continuing pattern ---------- */

// {
//   job_title: "Mobile App Developer",
//   job_id: "JOB-1035",
//   institution: "Apple",
//   category: "Mobile Development",
//   location: "Cupertino, CA",
//   salary_range: [120000, 180000],
//   description: "Build high-performance mobile applications.",
//   "req-qualifications": ["Swift or Kotlin", "Mobile UI", "Performance tuning"],
//   deadline: "2026-07-01",
//   start_date: "2026-09-01",
//   recruiter_id: "REC-135"
// },
// {
//   job_title: "Game Designer",
//   job_id: "JOB-1042",
//   institution: "Electronic Arts",
//   category: "Game Development",
//   location: "Los Angeles, CA",
//   salary_range: [80000, 120000],
//   description: "Design gameplay mechanics and player experiences.",
//   "req-qualifications": ["Game design theory", "Prototyping", "Collaboration"],
//   deadline: "2026-06-29",
//   start_date: "2026-08-30",
//   recruiter_id: "REC-142"
// },
// {
//   job_title: "Blockchain Engineer",
//   job_id: "JOB-1051",
//   institution: "Coinbase",
//   category: "Blockchain",
//   location: "Remote",
//   salary_range: [130000, 190000],
//   description: "Develop blockchain-based financial systems.",
//   "req-qualifications": ["Smart contracts", "Cryptography", "Distributed systems"],
//   deadline: "2026-06-17",
//   start_date: "2026-08-09",
//   recruiter_id: "REC-151"
// },
// {
//   job_title: "Technical Writer",
//   job_id: "JOB-1068",
//   institution: "Atlassian",
//   category: "Documentation",
//   location: "Remote",
//   salary_range: [70000, 100000],
//   description: "Create clear documentation for technical products.",
//   "req-qualifications": ["Technical writing", "APIs", "Editing"],
//   deadline: "2026-06-23",
//   start_date: "2026-08-15",
//   recruiter_id: "REC-168"
// },
// {
//   job_title: "Operations Analyst",
//   job_id: "JOB-1090",
//   institution: "Goldman Sachs",
//   category: "Operations",
//   location: "New York, NY",
//   salary_range: [85000, 125000],
//   description: "Analyze workflows to improve operational efficiency.",
//   "req-qualifications": ["Data analysis", "Process optimization", "Excel"],
//   deadline: "2026-06-26",
//   start_date: "2026-08-20",
//   recruiter_id: "REC-190"
// },
// {
//   job_title: "Machine Learning Engineer",
//   job_id: "JOB-1104",
//   institution: "OpenAI",
//   category: "Artificial Intelligence",
//   location: "San Francisco, CA",
//   salary_range: [140000, 210000],
//   description: "Deploy and optimize machine learning systems.",
//   "req-qualifications": ["ML frameworks", "Model deployment", "Python"],
//   deadline: "2026-06-30",
//   start_date: "2026-09-01",
//   recruiter_id: "REC-204"
// },
// {
//   job_title: "IT Support Specialist",
//   job_id: "JOB-1115",
//   institution: "Deloitte",
//   category: "IT Support",
//   location: "Tampa, FL",
//   salary_range: [60000, 85000],
//   description: "Provide technical support for internal systems.",
//   "req-qualifications": ["IT troubleshooting", "Customer support", "Networking basics"],
//   deadline: "2026-06-21",
//   start_date: "2026-08-10",
//   recruiter_id: "REC-215"
// }

