import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../hooks/useAuth";

/**
 * AdminDashboard.jsx
 * 
 * Dashboard for all admin users, contains website stats,users, and recruters needing approval. 
 * 
 * @author Esperanza Paulino
 */

export default function AdminDashboard() {
    const { user } = useAuth();

    const [seekersList, setSeekersList] = useState([]);
    const [recruitersList, setRecruitersList] = useState([]);

    const [userQuery, setUserQuery] = useState("");      // All Users search
    const [actionQuery, setActionQuery] = useState("");  // Action Needed search

    useEffect(() => {
        fetchUsers(setSeekersList, setRecruitersList);
    }, []);

    const users = [...seekersList, ...recruitersList];

    const filteredUsers = Search(users, userQuery);

    // Only recruiters who need approval
    const actionNeeded = recruitersList.filter(r => r.approved === false);
    const filteredActionUsers = Search(actionNeeded, actionQuery);

    const [randomNum] = useState(() => Math.floor(Math.random() * 1000));

    return (
        <div>
            <div className="hero bg-base-200 gap-2">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl">ADMIN DASHBOARD</h1>
                        <p>
                            Dear {user.displayName ? user.displayName : "admin"}, welcome to the admin dashboard. Here you can view site
                            statistics, search users, delete users, and approve recruiters as needed.
                        </p>

                        <h1 className="text-3xl font-bold pt-8">Site Statistics</h1>

                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <StatCard number={seekersList.length} label="Job Seekers" />
                            <StatCard number={recruitersList.length} label="Recruiters" />
                            <StatCard number={seekersList.length + recruitersList.length} label="Total Users" />
                            <StatCard number={randomNum} label="Site Traffic (views/hr)" />
                        </div>
                    </div>
                </div>
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full p-6">

                {/* LEFT — ALL USERS */}
                <div className="flex flex-col items-start bg-base-200 p-4 rounded h-full">
                    <h3 className="text-4xl font-bold">All Users</h3>

                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full max-w-xs my-4"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                    />

                    {filteredUsers.map((userToDelete) => (
                        <div
                            key={userToDelete.uid}
                            className="card bg-base-100 shadow-xl p-6 w-full max-w-3xl mx-auto my-3"
                        >
                            <h3>{userToDelete.display_name}</h3>
                            <p className="text-sm mt-2">{userToDelete.role}</p>

                            <button
                                className="btn btn-error btn-sm mt-4"
                                onClick={() => {
                                    if (seekersList.some(s => s.uid === userToDelete.uid)) {
                                        Delete(user, userToDelete.uid, setSeekersList);
                                    } else {
                                        Delete(user, userToDelete.uid, setRecruitersList);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* RIGHT — ACTION NEEDED */}
                <div className="flex flex-col items-start bg-base-200 p-4 rounded h-full">
                    <h3 className="text-4xl font-bold">Action Needed</h3>

                    <input
                        type="text"
                        placeholder="Search recruiters"
                        className="input input-bordered w-full max-w-xs my-4"
                        value={actionQuery}
                        onChange={(e) => setActionQuery(e.target.value)}
                    />

                    {filteredActionUsers.map((userToApprove) => (
                        <div
                            key={userToApprove.uid}
                            className="card bg-base-100 shadow-xl p-6 w-full max-w-3xl mx-auto my-3"
                        >
                            <h3>{userToApprove.display_name}</h3>
                            <p className="text-sm mt-2">{userToApprove.role}</p>

                            <button
                                className="btn btn-success btn-sm mt-4"
                                onClick={() => Approve(user, userToApprove.uid, setRecruitersList)}
                            >
                                Approve Recruiter
                            </button>
                        </div>
                    ))}
                </div>

            </div>

            <ToastContainer />
        </div>
    );
}

function StatCard({ number, label }) {
    return (
        <div className="flex flex-col items-center bg-base-200 p-4 rounded">
            <span className="text-4xl font-bold">{number}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
}

async function fetchUsers(setSeekersList, setRecruitersList) {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
        const data = await res.json();

        setSeekersList(data.filter(u => u.role === "job_seeker"));
        setRecruitersList(data.filter(u => u.role === "recruiter"));
    } catch (err) {
        console.error("Failed to fetch users:", err);
    }
}

async function Approve(user, userId, setRecruitersList) {

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
            approved: true,
        }),
    });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        setRecruitersList(prev =>
            prev.map(u =>
                u.uid === userId ? { ...u, approved: true } : u
            )
        );
        toast.success("Recruiter approved successfully!");
    } catch (err) {
        console.log("Failed to approve recruiter: ", err);
        toast.error("Failed to approve recruiter, please try again.");
    }

    
}

async function Delete(user, userId, setList) {
    
    const confirmed = await confirmToast("Delete this user?");
    if (!confirmed) return;

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        method: "DELETE",
            headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
            },
        });

        if (!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        setList(prev =>
            prev.filter(u => u.uid !== userId)
        );
        toast.success("User deleted successfully!");

    } catch (err){
        console.log("Error deleting user", err);
    }
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

function Search(list, query) {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(item =>
        Object.values(item).some(v =>
            String(v).toLowerCase().includes(q)
        )
    );
}
