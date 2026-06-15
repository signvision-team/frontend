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

// Append this to your existing auth api file

/// =========================
// UPDATE USER PROFILE (FIXED)
// =========================
export const updateUserProfile = async (userId, updateData, token) => {
  const data = await request(`/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  // Strict structural evaluation: if backend failed, or didn't explicitly return true
  if (!data || data.success === false || (!data.success && !data.user)) {
    return { 
      success: false, 
      message: data.message || "Database failed to persist profile changes." 
    };
  }

  return {
    success: true,
    user: data.user,
  };
};