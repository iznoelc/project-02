import UserProfilePicPlaceholder from "../../assets/UserProfilePicPlaceholder.png"
import { MdLabelImportant } from "react-icons/md";

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

    const isOwnProfile = user?.uid === uid;

    useEffect(() => {
        // if (!user || !uid) return;

        async function fetchUser(){
            setLoading(true);
            try {
            const res = await fetch(`http://localhost:3000/users/${uid}`, {
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

    }, [uid, user, navigate]);

    if (loading) return <FallbackElement />
    if (!profile) return <><h1>No profile found.</h1></>

    return (
        <>
            {profile && 
            <>
            <div className="min-h-screen flex flex-col max-w-xl w-full mx-auto items-center">
                <div>
                    <div className="flex flex-row items-center sm:items-start gap-6 p-4">
                        <img src={UserProfilePicPlaceholder} className="h-32 w-32 sm:w-40 sm:h-40 object-cover rounded-full"/>
                        
                        {isOwnProfile ?  (
                            <>
                            <div className="flex flex-col text-center sm:text-left p-2 gap-2">
                                <div className="flex"><MdLabelImportant /><p className="text-xs"><i>This is your profile.</i></p></div>
                                
                                <h1 className="text-4xl">{profile.user.display_name}</h1>
                                <h2>{profile.user.role} </h2>
                                
                                
                                <h2 className="wrap-break">{profile.user.bio ? profile.user.bio : "No bio yet."}</h2>
                            </div>
                            
                            </>
                        ) : (
                            <div className="flex flex-col text-center sm:text-left p-2 gap-2">
                                <h1 className="text-2xl">{profile.user.display_name}</h1>
                            </div>
                        )}
                        </div>
                    </div>
                    <FavoriteJobsDisplay profile={profile} isOwnProfile={isOwnProfile} />
                </div>
                <div className="flex flex-col items-center sm:items-start gap-6 p-4">
                    
                <h1></h1>
                </div>
            
            </>}
        </>
    )
};
