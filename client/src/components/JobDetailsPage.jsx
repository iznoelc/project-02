import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsPage from "../components/DetailsPage";
import useAuth from "../hooks/useAuth"; // or wherever your user comes from

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:3000/job-details/${id}`)
      .then(res => res.json())
      .then(data => setJob(data));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return <DetailsPage job={job} currentUser={currentUser} />;
}
