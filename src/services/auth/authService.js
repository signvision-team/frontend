const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

console.log("API BASE URL:", API_BASE);

// LOGIN
export const loginUser = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login Error:", error.message);
    return { success: false, message: error.message };
  }
};

// SIGNUP
export const signupUser = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    console.error("Signup Error:", error.message);
    return { success: false, message: error.message };
  }
};