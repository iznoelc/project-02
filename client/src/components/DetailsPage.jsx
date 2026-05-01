import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { getAuth } from "firebase/auth";

/**
 * DetailsPage.jsx
 * 
 * Job details fetched for the users to view in a nicer format. Also contains the application form for them to fill out and apply to jobs.
 * 
 * @author Esperanza Paulino
 */

export default function DetailsPage({ job }) {
  const { user, role } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [resumeLink, setResumeLink] = useState("");
  const [resumeFile, setResumeFile] = useState("");
  const [cover_letter, setCoverLetter] = useState("");

  return (
    <div>
      <div className="card lg:card-side bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">
            {job.job_title}
            <br />
            {job.institution}
          </h2>

          <p>
            <strong>Details</strong>
            <br />
            Category: {job.category}
            <br />
            Location: {job.location}
            <br />
            Salary Range:{" "}
            {job.salary_range[0].toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            })}{" "}
            –{" "}
            {job.salary_range[1].toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            })}
            <br />
            Job Description: {job.description}
            <br />
          </p>

          {job.req_qualifications?.length > 0 && (
            <>
              <p>
                <strong>Required Qualifications</strong>
              </p>
              <ul className="list-disc ml-6">
                {job.req_qualifications.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </>
          )}

          <p>
            <strong>Application deadline: {job.deadline}</strong>
          </p>
          <p>
            <strong>Expected start date: {job.start_date}</strong>
          </p>

          <div className="card-actions justify-end">
            {role !== "admin" && 
            <button className="btn btn-primary" onClick={() => setShowPopup(true)}>
              Apply Now
            </button>
            }
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Submit Your Application</h3>

            <p className="py-2">Paste your resume link below:</p>

            <input
              type="url"
              placeholder="Resume link"
              className="input input-bordered w-full"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
            />
            
            {/*
            Note: This upload works on the local level but is missing the proper API implimentation that would allow it to work on a deployment level.
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="input input-bordered w-full"
              onChange={(e) => setResumeFile(e.target.files[0])}
            /> 
            */ }

            <input
              type="text"
              placeholder="Cover Letter (optional)"
              className="input input-bordered w-full mt-3"
              value={cover_letter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />

            <div className="modal-action">
              <button className="btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!user) {
                    toast.error("You must be logged in to apply");
                    return;
                  }

                  submitApplication(
                    job._id,
                    user.uid,
                    resumeLink,
                    resumeFile,
                    cover_letter,
                    setResumeLink,
                    setCoverLetter,
                    setShowPopup
                  );
                }}
              >
                Submit
              </button>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowPopup(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

/* -----------------------------
   Helper Function
------------------------------ */

async function submitApplication(
  jobId,
  applicantId,
  resumeLink,
  resumeFile,
  cover_letter,
  setResumeLink,
  setCoverLetter,
  setShowPopup
) {
  console.log("Submitting:", { jobId, applicantId, resumeLink, cover_letter, resumeFile });

  const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

  // Require at least one: resumeLink OR resumeFile
  if (!resumeLink && !resumeFile) {
    toast.error("Please provide a resume link OR upload a file");
    return;
  }

  // If resumeLink exists, validate it
  if (resumeLink && !urlPattern.test(resumeLink)) {
    toast.error("Please enter a valid URL");
    return;
  }

  try {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();

    // Use FormData for file uploads
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("applicantId", applicantId);
    formData.append("resumeLink", resumeLink || "");
    formData.append("cover_letter", cover_letter || "");

    if (resumeFile) {
      formData.append("resumeFile", resumeFile); // Multer expects this name
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
        // ❗ DO NOT set Content-Type — browser sets it automatically
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Application submitted!");
      setShowPopup(false);
      setResumeLink("");
      setCoverLetter("");
    } else {
      toast.error(data.error || "Something went wrong");
    }
  } catch (err) {
    console.error("Submit error:", err);
    toast.error("Network error");
  }
}
