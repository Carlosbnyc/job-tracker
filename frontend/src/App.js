import { useState, useEffect } from "react";
import { addJobToServer, fetchJobs } from "./api"; 
import JobForm from "./JobForm";
import JobList from "./JobList";
import Auth from "./Auth";
import Navbar from "./NavBar"; // Ensure filename matches case sensitivity
import "./App.css"; 

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
    const newJob = await addJobToServer(job);
    setJobs([...jobs, newJob]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="app-container">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      {!isAuthenticated ? (
        <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <div className="content">
          <h1 className="app-title">Job Tracker</h1>
          <JobForm addJob={handleAddJob} />
          <JobList jobs={jobs} />
        </div>
      )}
    </div>
  );
}

export default App;