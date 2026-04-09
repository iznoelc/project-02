export default function DetailsPage({ job_name, photo, about_us, pay, requirements }) {
  return (
    <div>
      <div className="card lg:card-side bg-base-100 shadow-sm">

        {photo && (
          <figure>
            <img src={photo} alt="Job Image" />
          </figure>
        )}

        <div className="card-body">
          {job_name && <h2 className="card-title">{job_name}</h2>}
          {about_us && (
            <p>
              <strong>About Us</strong><br />
              {about_us}
            </p>
          )}

          {requirements && requirements.length > 0 && (
            <>
              <p><strong>Requirements</strong></p>
              <ul className="list-disc ml-6">
                {requirements.map(req => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </>
          )}

          {pay && <p><strong>Expected Pay:</strong> {pay}</p>}

          <div className="card-actions justify-end">
            <button className="btn btn-primary">Apply Now</button>
          </div>

        </div>
      </div>
    </div>
  );
}
