import UserProfilePicPlaceholder from "../assets/UserProfilePicPlaceholder.png"

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import FallbackElement from "../components/FallbackElement"

import useAuth from "../hooks/useAuth";

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
            <div className="min-h-screen m-w-lg flex flex-col items-center justify-center">
                <div>
                    <div className="flex p-2">
                        <img src={UserProfilePicPlaceholder} className="image-full max-w-xs"/>
                        <div className="flex flex-col">
                        {isOwnProfile ?  (
                            <input 
                                type="text"
                                value={profile.user.display_name}
                            />
                        ) : (
                            <h1 className="text-2xl">{profile.user.display_name}</h1>
                        )}
                        <p>test</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p>Test</p>
                </div>
            </div>
            </>}
        </>
    )
};
