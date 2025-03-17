function JobList({ jobs }) {
    return (
      <div>
        <h2>Jobs Applied</h2>
        {jobs.length === 0 ? (
          <p>No jobs added yet.</p>
        ) : (
          <ul>
            {jobs.map((job) => (
              <li key={job.id}>
                <strong>{job.company}</strong> - {job.position} <br />
                <a href={job.link} target="_blank" rel="noopener noreferrer">Job Link</a> <br />
                Status: {job.status} | Date Applied: {job.dateApplied || "N/A"}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  export default JobList;