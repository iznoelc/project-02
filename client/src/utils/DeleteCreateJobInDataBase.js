import { errorNotify, successNotify } from "../utils/ToastifyNotifications";


export async function deletePosting(job_id, user, fetchData, confirmToast ) {
    const confirmed = await confirmToast("Delete this Job Posting?");
    if (!confirmed) return;

    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/job_postings/${job_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        fetchData(user)
        successNotify("Job Posting deleted");
    } else {
        errorNotify("uh oh, failed to delete job posting");
    }
}


export async function createPosting(user, fetchData, formData) {
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
        recruiter_id,
        } = formData;    

        try {
        const response = await fetch("${import.meta.env.VITE_API_URL}/job_postings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await user.getIdToken()}`, // include the Firebase ID token in the Authorization header
            },
            
            body: JSON.stringify({
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
        console.error("Error creating job in database:", error);
        if (user) {
            try {
            } catch (deleteError) {
                console.error("Error deleting job posting after failed database creation:", deleteError);   
            }
        }
    };
    fetchData(user)
    
}