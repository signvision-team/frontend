const API_BASE = import.meta.env.VITE_API_BASE;
console.log("API BASE URL:", API_BASE);
export const loginUser = async (formData) => {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    return res.json();
};

export const signupUser = async (formData) => {
    const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    return res.json();
};