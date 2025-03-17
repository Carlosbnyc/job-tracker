import { useState, useEffect } from "react";
import { addJobToServer, fetchJobs } from "./api"; // FIXED IMPORTS
import JobForm from "./JobForm";
import JobList from "./JobList";
import Auth from "./Auth";


function App() {
  const [jobs, setJobs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (isAuthenticated) {
      async function loadJobs() {
        const jobsFromServer = await fetchJobs();
        setJobs(jobsFromServer);
      }
      loadJobs();
    }
  }, [isAuthenticated]);

  const handleAddJob = async (job) => {
    const newJob = await addJobToServer(job); // FIXED FUNCTION CALL
    setJobs([...jobs, newJob]);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <h1>Job Tracker</h1>
          <img 
           src="/static/media/jobtracker-logo.1db786da2f2c064b0357.jpg" 
          alt="Job Tracker Logo" 
          style={{ width: "150px", height: "auto" }} 
        />
          <button onClick={() => { localStorage.removeItem("token"); setIsAuthenticated(false); }}>
            Logout
          </button>
          <JobForm addJob={handleAddJob} />
          <JobList jobs={jobs} />
        </>
      )}
    </div>
  );
}

export default App;