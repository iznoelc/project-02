import { useState } from "react";
import { toast } from "react-toastify";

export default function DetailsPage({ job, currentUser }) {
  const [showPopup, setShowPopup] = useState(false);
  const [resumeLink, setResumeLink] = useState("");

  return (
    <div>
      <div className="card lg:card-side bg-base-100 shadow-sm">

        <div className="card-body">
          <h2 className="card-title">{job.job_title}<br />{job.institution}</h2>

          <p>
            <strong>Details</strong><br />
            Category: {job.category}<br />
            Location: {job.location}<br />
            Salary Range: {job.salary_range}<br />
            Job Description: {job.description}<br />
          </p>

          {job.req_qualifications?.length > 0 && (
            <>
              <p><strong>Required Qualifications</strong></p>
              <ul className="list-disc ml-6">
                {job.req_qualifications.map(req => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </>
          )}


          <p><strong>Application deadline: {job.deadline}</strong></p>
          <p><strong>Expected start date: {job.start_date}</strong></p>

          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => setShowPopup(true)}>
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* DaisyUI Modal */}
      {showPopup && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Submit Your Application</h3>

            <p className="py-2">Paste your resume link below:</p>

            <input
              type="text"
              placeholder="Resume link"
              className="input input-bordered w-full"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
            />

            <div className="modal-action">
              <button 
                className="btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>

              <button 
                className="btn btn-primary"
                onClick={() =>
                  submitApplication(
                    job._id,
                    currentUser._id,
                    resumeLink,
                    setResumeLink,
                    setShowPopup
                  )
                }
              >
                Submit
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

//helper functions

async function submitApplication(
  jobId,
  applicantId,
  resumeLink,
  setResumeLink,
  setShowPopup
) {
  if (!resumeLink.trim()) {
    toast.error("Please enter a resume link");
    return;
  }

  const response = await fetch("http://localhost:3000/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId,
      applicantId,
      resumeLink
    })
  });

  const data = await response.json();

  if (response.ok) {
    toast.success("Application submitted!");
    setShowPopup(false);
    setResumeLink("");
  } else {
    toast.error(data.error || "Something went wrong");
  }
}
