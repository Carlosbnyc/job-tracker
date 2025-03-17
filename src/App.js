import { useState } from "react";
import JobForm from "./JobForm";
import JobList from "./JobList";



function App() {
  const [jobs, setJobs] = useState([]);

  const addJob = (job) => {
    setJobs([...jobs, job]);
  };

  return (
    <div>
      <h1>Job Tracker</h1>
      <JobForm addJob={addJob} />
      <JobList jobs={jobs} />
    </div>
  );
}

export default App;