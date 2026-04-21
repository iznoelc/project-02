import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function AdminDashboard() {

    const [seekersList, setSeekersList] = useState([]);
    const [recruitersList, setRecruitersList] = useState([]);
    const [userQuery, setUserQuery] = useState("");

    useEffect(() => {
        fetchUsers(setSeekersList, setRecruitersList);
    }, []);

    const users = [...seekersList, ...recruitersList];
    const filteredUsers = Search(users, userQuery);

    const [randomNum] = useState(() => Math.floor(Math.random() * 1000));

    return (
        <div>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h3>ADMIN DASHBOARD</h3>
                        <p>
                            Dear Admin, welcome to the admin dashboard. Here you can view site
                            statistics, search users, and delete them as needed.
                        </p>

                        <h1 className="text-5xl font-bold">Site Statistics</h1>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <StatCard number={seekersList.length} label="Job Seekers" />
                            <StatCard number={recruitersList.length} label="Recruiters" />
                            <StatCard number={seekersList.length + recruitersList.length} label="Total Users" />
                            <StatCard number={randomNum} label="Site Traffic (views/hr)" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center bg-base-200 p-4 rounded">
                <h3 className="text-4xl font-bold">Users</h3>

                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-full max-w-xs my-4"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                />

                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="card bg-base-100 shadow-xl p-6 w-full max-w-3xl mx-auto my-3"
                    >
                        <h3>{user.display_name}</h3>
                        <p className="text-sm mt-2">{user.role}</p>

                        <button
                            className="btn btn-error btn-sm mt-4"
                            onClick={() => {
                                if (seekersList.some(s => s._id === user._id)) {
                                    Delete(user._id, setSeekersList);
                                } else {
                                    Delete(user._id, setRecruitersList);
                                }
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
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
        const res = await fetch("http://localhost:3000/users");
        const data = await res.json();

        setSeekersList(data.filter(u => u.role === "job_seeker"));
        setRecruitersList(data.filter(u => u.role === "recruiter"));
    } catch (err) {
        console.error("Failed to fetch users:", err);
    }
}

async function Delete(userId, setList) {
    const confirmed = await confirmToast("Delete this user?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        setList(prev => prev.filter(u => u._id !== userId));
        toast.success("User deleted");
    } else {
        toast.error("uh oh, failed to delete user");
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
