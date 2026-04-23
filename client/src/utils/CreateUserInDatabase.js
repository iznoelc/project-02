export const createRecruiterInDatabase = async (user, formData, setSignUpLoading) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await user.getIdToken()}`, // include the Firebase ID token in the Authorization header
            },
            body: JSON.stringify({
                uid: user.uid,
                display_name: formData.display_name,
                role: formData.role,
                organization: formData.org_name,
                website: formData.org_website,
                location: formData.org_location,
                approved: false,
            }),
    });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // const data = await response.json();
        // console.log("User successfully created in database:", data); 
    } catch (error) {
        setSignUpLoading(false);
        console.error("Error creating user in database:", error);
        if (user) {
            try {
                await user.delete();
            } catch (deleteError) {
                console.error("Error deleting user after failed database creation:", deleteError);   
            }
        }
    };
}

export const createJobSeekerInDatabase = async (user, setSignUpLoading, display_name, role) => {
        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await user.getIdToken()}`, // include the Firebase ID token in the Authorization header
            },
            body: JSON.stringify({
                uid: user.uid,
                display_name,
                role,
        }),
    });

        const text = await response.text();
        console.log("Response text:", text);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // const data = await response.json();
        // console.log("User successfully created in database:", data); 
    } catch (error) {
        setSignUpLoading(false);
        console.error("Error creating user in database:", error);
        if (user) {
            try {
                await user.delete();
            } catch (deleteError) {
                console.error("Error deleting user after failed database creation:", deleteError);   
            }
        }
    };
}