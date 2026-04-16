import { useState } from "react";
import { toast } from "react-toastify";

export default function DetailsPage({ job, currentUser }) {
  const [showPopup, setShowPopup] = useState(false);
  const [resumeLink, setResumeLink] = useState("");

  return (
    <div>
      <div className="card lg:card-side bg-base-100 shadow-sm">

        {job.photo && (
          <figure>
            <img src={job.photo} alt="Job Image" />
          </figure>
        )}

        <div className="card-body">
          <h2 className="card-title">{job.job_name}</h2>

          <p>
            <strong>About Us</strong><br />
            {job.about_us}
          </p>

          {job.requirements?.length > 0 && (
            <>
              <p><strong>Requirements</strong></p>
              <ul className="list-disc ml-6">
                {job.requirements.map(req => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </>
          )}

          <p><strong>Expected Pay:</strong> {job.pay}</p>

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

  const response = await fetch("/applications", {
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
