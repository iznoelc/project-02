import UserProfilePicPlaceholder from "../../assets/UserProfilePicPlaceholder.png"
import { MdLabelImportant } from "react-icons/md";
import { FaPen } from "react-icons/fa";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import FallbackElement from "../FallbackElement"
import FavoriteJobsDisplay from "./FavoriteJobsDisplay"

import useAuth from "../../hooks/useAuth";

export default function UserProfile(){
    const { uid } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const isOwnProfile = user?.uid === uid;

    useEffect(() => {
        // if (!user || !uid) return;

        async function fetchUser(){
            setLoading(true);
            try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${uid}`, {
            headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
            },
            });

            const data = await res.json();
            
            console.log("USER RESPONSE: ", data);

            if (!res.ok){
                navigate("/error", { state: { code: res.status } })
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            setProfile(data);
            console.log("Profile: ", data);
            
            } catch (err) {
                console.error("Error fetching user profile:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();

    }, [uid, user]);

    if (loading) return <FallbackElement />
    if (!profile) return <><h1>No profile found.</h1></>

    return (
        <>
            {profile && 
            <>
            <div className="flex flex-col w-full items-center p-16">
                <div className="w-full grid grid-cols-2 max-w-4xl items-center bg-base-200 rounded drop-shadow-2xl p-8">
                        <div className="flex flex-col items-center w-full p-2 gap-2">
                            <img src={UserProfilePicPlaceholder} className="h-32 w-32 sm:w-40 sm:h-40 object-cover rounded-full"/>
                        </div>
                        
                        
                        {isOwnProfile ?  (
                            <>
                            <div className="flex flex-col items-center w-full text-left p-2 gap-2">
                                <div className="flex flex-row gap-2">
                                    <div className="flex"><MdLabelImportant /><p className="text-xs"><i>This is your profile.</i></p></div>
                                    {isEditing ? <></> : <button onClick={() => setIsEditing(true)}><FaPen /></button>}
                                </div>
                                {isEditing ?
                                <>
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Edit Display Name</legend>
                                        <input type="text" className="input w-96" placeholder={profile.user.display_name} />
                                        
                                    </fieldset>
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Edit Role</legend>
                                        <input type="text" placeholder={profile.user.role} className="input w-96" disabled />
                                    </fieldset>

                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Edit Email</legend>
                                        <input type="text" placeholder={user.email} className="input w-96" disabled />
                                    </fieldset>
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Edit Bio</legend>
                                        <input type="text" className="input w-96" placeholder={profile.user.bio} />
                                    </fieldset>

                                    <button className="btn btn-primary" onClick={() => setIsEditing(false)}>Save</button>
                                    
                                </>
                                :
                                <>
                                     <h1 className="text-4xl">{profile.user.display_name}</h1>
                                    <h2>{profile.user.role} </h2>
                                
                                
                                    <h2 className="wrap-break">{profile.user.bio ? profile.user.bio : "No bio yet."}</h2>
                                </>
                                }
                               
                            </div>
                            
                            </>
                        ) : (
                            <div className="flex flex-col items-center w-full text-left p-2 gap-2">
                                    <h1 className="text-4xl">{profile.user.display_name}</h1>
                                    <h2>{profile.user.role} </h2>
                                
                                
                                    <h2 className="wrap-break">{profile.user.bio ? profile.user.bio : "No bio yet."}</h2>
                            </div>
                        )}
                        </div>
                    
                </div>  
                <div className="flex flex-col w-full items-center p-16">
                    {profile.user.role === "job_seeker" &&
                        <FavoriteJobsDisplay profile={profile} isOwnProfile={isOwnProfile} />
                    }
                    {profile.user.role === "recruiter" &&
                    <>
                        <h1 className="text-2xl">ADDITIONAL RECRUITER ACCOUNT INFORMATION</h1>
                        {isEditing ? 
                            <p>Editing profile</p>
                            :
                            <h2>{profile.user.organization} | {profile.user.location} | {profile.user.website}</h2>
                        }
                    </>
                    }
                </div>
            
            </>}
        </>
    )
};
