import React, { useEffect, useState } from "react";
import './JobList.css'; // Import the CSS for styling

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data); // Update state with fetched jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="job-list-container">
      <h2>Jobs Applied</h2>
      {jobs.length === 0 ? (
        <p>No jobs added yet.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.company_name}</strong> - {job.job_title} <br />
              <a href={job.job_link} target="_blank" rel="noopener noreferrer">
                Job Link
              </a>{" "}
              <br />
              <span className="status">Status: {job.status}</span> |{" "}
              <span className="date">Date Applied: {new Date(job.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;