import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsPage from "../components/DetailsPage";
import useAuth from "../hooks/useAuth";

export default function JobDetailsPage() {
  const { _id } = useParams();          // ✅ correct param
  const [job, setJob] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!_id) return;                   // ✅ wait for param

    fetch(`http://localhost:3000/job_postings/${_id}`)   // ✅ correct backend route
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error("Fetch error:", err));
  }, [_id]);                             // ✅ correct dependency

  if (!job || !currentUser) return <p>Loading...</p>;

  return <DetailsPage job={job} currentUser={currentUser} />;
}
