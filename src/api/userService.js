const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Generic fetch wrapper with timeout + error handling
 */
const request = async (url, options = {}) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${url}]:`, error.message);

    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }

    throw error;
  }
};

/**
 * LOGIN USER
 */
export const loginUser = async (formData) => {
  return await request("/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

/**
 * SIGNUP USER
 */
export const signupUser = async (formData) => {
  return await request("/signup", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

/**
 * GET CURRENT USER
 */
export const getCurrentUser = async (token) => {
  return await request("/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * UPDATE USER PROFILE
 */
export const updateUser = async (userId, updateData, token) => {
  return await request(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * DELETE USER
 */
export const deleteUser = async (userId, token) => {
  return await request(`/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};