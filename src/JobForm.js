import { useState } from "react";

function JobForm({ addJob }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [link, setLink] = useState("");
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company || !position || !link) return; // Ensure link is not empty
  
    addJob({ 
      company, 
      position, 
      status, 
      link, 
      dateApplied: dateApplied || new Date().toISOString().split("T")[0], // Store date properly
      id: Date.now() 
    });
  
    // Reset input fields after submission
    setCompany("");
    setPosition("");
    setStatus("Applied");
    setLink("");
    setDateApplied(new Date().toISOString().split("T")[0]); // Reset date to today
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Company Name" 
        value={company} 
        onChange={(e) => setCompany(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Job Title" 
        value={position} 
        onChange={(e) => setPosition(e.target.value)} 
      />
       <input 
        type="url" 
        placeholder="Job Link (URL)" 
        value={link} 
        onChange={(e) => setLink(e.target.value)} 
      />
      <input 
        type="date" 
        value={dateApplied} 
        onChange={(e) => setDateApplied(e.target.value)} 
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
      <button type="submit">Add Job</button>
    </form>
  );
}

export default JobForm;