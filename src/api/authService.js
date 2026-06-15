const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

console.log("API BASE URL:", API_BASE);

// =========================
// Helper: API Request
// =========================
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    return { success: false, message: error.message };
  }
};

// =========================
// LOGIN
// =========================
export const loginUser = async (formData) => {
  const data = await request("/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (!data.success) {
    return { success: false, message: data.message };
  }

  return {
    success: true,
    token: data.token,
    user: data.user,

    // ✅ robust orgID handling (fixes missing cases)
   orgID: data.orgID || data.orgId || data.user?.orgID || null,
  };
};

// =========================
// SIGNUP
// =========================
export const signupUser = async (formData) => {
  const data = await request("/signup", {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (!data.success) {
    return { success: false, message: data.message };
  }

  return {
    success: true,
    token: data.token || null,
    user: data.user,

    // backend may return it in different ways → handled safely
    orgID:
      data.orgID ||
      data.user?.orgID ||
      data.user?.organizationId ||
      null,

    message: data.message,
  };
};

// =========================
// GET CURRENT USER (optional but useful)
// =========================
export const getMe = async (token) => {
  const data = await request("/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    return { success: false, message: data.message };
  }

  return {
    success: true,
    user: data.user,
  };
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