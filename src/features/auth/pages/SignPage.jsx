import React, { useState, useEffect } from "react";

const SignPage = ({ navigate, VIEWS, setUserType, handleLogin }) => {
  const [loginType, setLoginType] = useState("INDIVIDUAL");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    orgId: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔥 FIX: reset form when switching login type
  useEffect(() => {
    setFormData({ email: "", password: "", orgId: "" });
  }, [loginType]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      userType: loginType,
      // 🔥 FIX: backend expects orgID (not orgId)
      orgID: loginType === "ORGANIZATION" ? formData.orgId.trim() : null,
    };

    try {
      const result = await handleLogin(payload);

      if (result && result.success) {

        const backendUserType = result.user?.userType;
        const finalUserType = backendUserType || loginType;

        if (setUserType) setUserType(finalUserType);

        // clear old session
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        localStorage.removeItem("orgId");

        // save new session
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        localStorage.setItem("userType", finalUserType);

        // 🔥 FIX: consistent org id handling
        const orgIdValue =
          result.user?.orgID ||
          result.user?.orgId ||
          result.user?.organizationId ||
          null;

        if (orgIdValue) {
          localStorage.setItem("orgId", orgIdValue);
        }

        navigate(VIEWS.DASHBOARD);
      } else {
        alert(result?.message || "Login failed");
      }

    } catch (err) {
      console.error("Login component error:", err);
      alert("An unexpected error occurred. Please check backend.");
    }
  };

  const inputStyle = {
    backgroundColor: "#1e1e2f",
    color: "#ffffff",
    border: "1px solid #4a67ff",
    borderRadius: "6px",
    padding: "10px",
    width: "100%",
    marginTop: "5px",
    outline: "none",
  };

  const getToggleStyle = (type) => ({
    flex: 1,
    padding: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "8px",
    backgroundColor:
      loginType === type ? "#4a67ff" : "rgba(255, 255, 255, 0.1)",
    color: loginType === type ? "#fff" : "#ccc",
    transition: "all 0.3s ease",
  });

  return (
    <div
      className="sign-in-page-wrapper"
      style={{
        minHeight: "100vh",
        backgroundColor: "#121123",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img src="/svLogo.png" alt="SignVision" style={{ height: "80px" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            backgroundColor: "#1a1a2f",
            padding: "30px",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
            <button
              type="button"
              style={getToggleStyle("INDIVIDUAL")}
              onClick={() => setLoginType("INDIVIDUAL")}
            >
              Individual
            </button>

            <button
              type="button"
              style={getToggleStyle("ORGANIZATION")}
              onClick={() => setLoginType("ORGANIZATION")}
            >
              Organization
            </button>
          </div>

          <h2 style={{ color: "#fff", textAlign: "center" }}>
            Welcome Back
          </h2>

          <form onSubmit={onSubmit}>
            {loginType === "ORGANIZATION" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ color: "#ccc" }}>Organization ID</label>
                <input
                  type="text"
                  name="orgId"
                  value={formData.orgId}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            )}

            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#ccc" }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#ccc" }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#4a67ff",
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "bold",
                border: "none",
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p style={{ color: "#ccc" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "#4a67ff", cursor: "pointer", fontWeight: "bold" }}
                onClick={() => navigate(VIEWS.SIGN_UP_TYPE)}
              >
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignPage;