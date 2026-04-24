import React, { useState } from "react";

const SignPage = ({ navigate, VIEWS, setUserType, handleLogin }) => {
  const [loginType, setLoginType] = useState("INDIVIDUAL");
  const [formData, setFormData] = useState({ email: "", password: "", orgId: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (setUserType) setUserType(loginType);

    const payload = {
      email: formData.email,
      password: formData.password,
      userType: loginType,
      orgID: loginType === "ORGANIZATION" ? formData.orgId : null
    };

    try {
      const success = await handleLogin(payload);
      if (success) {
        navigate(VIEWS.DASHBOARD);
      }
    } catch (err) {
      console.error("Login component error:", err);
      alert("An unexpected error occurred. Please check your connection.");
    }
  };

  const inputStyle = {
    backgroundColor: "#1e1e2f", color: "#ffffff", border: "1px solid #4a67ff",
    borderRadius: "6px", padding: "10px", width: "100%", marginTop: "5px", outline: "none"
  };

  const getToggleStyle = (type) => ({
    flex: 1, padding: "10px", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "8px",
    backgroundColor: loginType === type ? "#4a67ff" : "rgba(255, 255, 255, 0.1)",
    color: loginType === type ? "#fff" : "#ccc", transition: "all 0.3s ease"
  });

  return (
    <div className="sign-in-page-wrapper" style={{ minHeight: "100vh", backgroundColor: "#121123", padding: "20px" }}>
      <div className="corner-logo-container" style={{ textAlign: "center", marginBottom: "30px" }}>
        <img src="/svLogo.png" alt="SignVision" style={{ height: '80px' }} />
      </div>

      <div className="hero-section" style={{ display: "flex", justifyContent: "center" }}>
        <div className="card-common form-reg-card" style={{ maxWidth: '400px', width: "100%", backgroundColor: "#1a1a2f", padding: "30px", borderRadius: "12px", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "25px", background: "rgba(255,255,255,0.05)", padding: "5px", borderRadius: "10px" }}>
            <button type="button" style={getToggleStyle("INDIVIDUAL")} onClick={() => setLoginType("INDIVIDUAL")}>Individual</button>
            <button type="button" style={getToggleStyle("ORGANIZATION")} onClick={() => setLoginType("ORGANIZATION")}>Organization</button>
          </div>

          <h2 style={{ color: "#ffffff", marginBottom: "20px", textAlign: "center" }}>Welcome Back</h2>

          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            {loginType === "ORGANIZATION" && (
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="loginOrgId" style={{ color: "#ccc" }}>Organization ID</label>
                <input 
                  id="loginOrgId"
                  type="text" 
                  name="orgId" 
                  placeholder="Enter Org ID" 
                  onChange={handleChange} 
                  required 
                  style={inputStyle} 
                  value={formData.orgId}
                  autoComplete="off"
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="loginEmail" style={{ color: "#ccc" }}>Email</label>
              <input 
                id="loginEmail"
                type="email" 
                name="email" 
                placeholder="Enter Email" 
                onChange={handleChange} 
                required 
                style={inputStyle} 
                value={formData.email}
                autoComplete="username"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label htmlFor="loginPassword" style={{ color: "#ccc" }}>Password</label>
              <input 
                id="loginPassword"
                type="password" 
                name="password" 
                placeholder="Enter Password" 
                onChange={handleChange} 
                required 
                style={inputStyle} 
                value={formData.password}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", backgroundColor: "#4a67ff", color: "#fff", padding: "10px", borderRadius: "8px", fontWeight: "bold", marginTop: "10px", cursor: "pointer", border: "none" }}>
              Sign In
            </button>
          </form>

          <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#ccc", textAlign: 'center' }}>
            <p>
              Don't have an account?{" "}
              <span className="link-text" style={{ cursor: "pointer", color: "#4a67ff", fontWeight: "bold" }} onClick={() => navigate(VIEWS.SIGN_UP_TYPE)}>
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