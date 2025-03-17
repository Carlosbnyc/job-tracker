const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001"; // Default to localhost if not defined

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const registerUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Signup failed");
  return response.json();
};

// ✅ Fetch jobs from backend
export async function fetchJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`);
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

// ✅ Add a new job to the backend
export async function addJobToServer(job) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      throw new Error("Failed to add job");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding job:", error);
    return null;
  }
}