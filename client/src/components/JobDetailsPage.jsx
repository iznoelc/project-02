import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsPage from "../components/DetailsPage";
import useAuth from "../hooks/useAuth";

export default function JobDetailsPage() {
  const { _id } = useParams();
  const [job, setJob] = useState(null);
  const { user } = useAuth();                
  console.log("useAuth returned:", useAuth());

  useEffect(() => {
    //if (!_id || !user) return;         

    async function fetchJob() {
      try {
        const token = await user.getIdToken(); 

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/job_postings/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Fetch failed:", res.status);
          return;
        }

        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchJob();
  }, [_id, user]);

  if (!job || !user) return <p>Loading...</p>;
  

  return <DetailsPage job={job} user={user} />;
}
