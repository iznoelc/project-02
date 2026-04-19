import { useParams } from "react-router-dom";
import { useEffect } from "react";

import useAuth from "../hooks/useAuth";

export default function UserProfile(){
    const { uid } = useParams();
    const { user } = useAuth();

    useEffect(() => {

        async function fetchUser(){
            try {
            const res = await fetch(`http://localhost:3000/users/${uid}`, {
            headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
            },
            });

            const data = await res.json();

            console.log("USER RESPONSE: ", data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        }

        fetchUser();

    }, [uid, user])

    return (
        <>
            <p>This is the profile for user with uid {uid}</p>
        </>
    )
};
