import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
//npm install react-toastify

export default function AdminDashboard( ){
    //Mock Data
    const admin_name = "Steve";

    const seekers = [
    { id: 1, name: "Alice Johnson", role: "Job Seeker", skills: ["JavaScript", "React"], experience: 2 },
    { id: 2, name: "Mark Thompson", role: "Job Seeker", skills: ["Python", "Django"], experience: 4 },
    { id: 3, name: "Sarah Lee", role: "Job Seeker", skills: ["UI/UX", "Figma"], experience: 1 },
    ];

    const recruiters = [
    { id: 101, name: "TechCorp HR", role: "Recruiter", company: "TechCorp" },
    { id: 102, name: "BrightHire Agency", role: "Recruiter", company: "BrightHire" },
    { id: 103, name: "InnovateX Talent", role: "Recruiter", company: "InnovateX" },
    ];

    const jobs = [
    { id: 201, title: "Frontend Developer", company: "TechCorp", location: "Remote" },
    { id: 202, title: "Backend Engineer", company: "BrightHire", location: "New York" },
    { id: 203, title: "UI/UX Designer", company: "InnovateX", location: "San Francisco" },
    ];

    //States
    const [seekersList, setSeekersList] = useState(seekers);
    const [jobsList] = useState(jobs);
    const [recruitersList, setRecruitersList] = useState(recruiters);
    //Search Query
    const [userQuery, setUserQuery] = useState("");

    //make users list
    const users = [...recruitersList, ...seekersList];
    //Filtered results for searching
    const filteredUsers = Search(users, userQuery);

    //Rand Stat
    const [randomNum] = useState(() => Math.floor(Math.random() * 1000));

    return(
        <div>
            {/*Stats Page*/}
            <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-md">
                <h3>ADMIN DASHBOARD</h3>
                <p>Dear {admin_name}, welcome to the admin dashboard. Here you can view site statistics, search users and jobs, and delete them as needed. As a young company we welcome critque, feel free to reach out to us at Gleebus@yahoo.com.</p>
                <h1 className="text-5xl font-bold">Site Statistics</h1>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center bg-base-200 p-4 rounded">
                        <span className="text-4xl font-bold">{seekersList.length}</span>
                        <span className="text-sm">Job Seekers</span>
                    </div>

                    <div className="flex flex-col items-center bg-base-200 p-4 rounded">
                        <span className="text-4xl font-bold">{recruitersList.length}</span>
                        <span className="text-sm">Recruiters</span>
                    </div>

                    <div className="flex flex-col items-center bg-base-200 p-4 rounded">
                        <span className="text-4xl font-bold">{jobsList.length}</span>
                        <span className="text-sm">Available/Posted Jobs</span>
                    </div>

                    <div className="flex flex-col items-center bg-base-200 p-4 rounded">
                        <span className="text-4xl font-bold">{randomNum}</span>
                        <span className="text-sm">Site Traffic (views per hr. average)</span>
                    </div>
                    </div>
                </div>
            </div>
            </div>

            <div >
                    {/*Users Page*/}
                    <h3>Users</h3>
                    <div className="flex flex-col items-center bg-base-200 p-4 rounded">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-full max-w-xs my-4"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                        />
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="card bg-base-100 shadow-xl p-6 w-full max-w-3xl mx-auto my-3"
                                >
                                <p className="text-4xl font-bold">{user.name}</p>
                                <p className="text-sm mt-2">{user.role}</p>

                                <button
                                    className="btn btn-error btn-sm mt-4"
                                    onClick={() => {
                                    if (seekersList.some(s => s.id === user.id)) {
                                        Delete(seekersList, setSeekersList, user.id);
                                    } else {
                                        Delete(recruitersList, setRecruitersList, user.id);
                                    }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
            </div>
            <ToastContainer />
        </div>
    )
}

//Helper Functions
async function Delete(list, setList, id) {
    const confirmed = await confirmToast("Delete this item?");

    if (!confirmed) return; // user clicked No
    setList(prev => prev.filter(item => item.id !== id));
}

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
                resolve(true);   // user confirmed
                closeToast();
              }}
            >
              Yes
            </button>

            <button
              className="btn btn-sm"
              onClick={() => {
                resolve(false);  // user cancelled
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

function Search(list, query) {
  if (!query) return list;
  const q = query.toLowerCase();
  return list.filter(item =>
    Object.values(item).some(v =>
      String(v).toLowerCase().includes(q)
    )
  );
}
