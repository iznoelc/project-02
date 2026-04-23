import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsPage from "../components/DetailsPage";
import useAuth from "../hooks/useAuth";

export default function JobDetailsPage() {
  const { _id } = useParams();
  const [job, setJob] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!_id || !currentUser) return;

    async function fetchJob() {
      try {
        const token = await currentUser.getIdToken();  

        const res = await fetch(`http://localhost:3000/job_postings/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,         
          },
        });

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
  }, [_id, currentUser]); 

  if (!job || !currentUser) return <p>Loading...</p>;

  return <DetailsPage job={job} currentUser={currentUser} />;
}
