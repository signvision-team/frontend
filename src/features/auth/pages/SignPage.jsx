import React, { useState, useEffect, useRef } from "react";

const SignPage = ({ navigate, VIEWS, setUserType, handleLogin }) => {
  const [loginType, setLoginType] = useState("INDIVIDUAL");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    orgId: ""
  });

  // Reference to hook up scrolling if redirected from another page
  const footerRef = useRef(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    setFormData({ email: "", password: "", orgId: "" });
  }, [loginType]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      userType: loginType,
      orgID: loginType === "ORGANIZATION" ? formData.orgId.trim() : null,
    };

    try {
      const result = await handleLogin(payload);
      if (result && result.success) {
        const backendUserType = result.user?.userType;
        const finalUserType = backendUserType || loginType;
        if (setUserType) setUserType(finalUserType);

        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        localStorage.setItem("userType", finalUserType);

        const orgIdValue = result.user?.orgID || result.user?.orgId || result.user?.organizationId || null;
        if (orgIdValue) localStorage.setItem("orgId", orgIdValue);

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
    backgroundColor: "rgba(30, 30, 47, 0.8)",
    color: "#ffffff",
    border: "1px solid rgba(74, 103, 255, 0.5)",
    borderRadius: "8px",
    padding: "12px",
    width: "100%",
    marginTop: "8px",
    outline: "none",
  };

  const getToggleStyle = (type) => ({
    flex: 1,
    padding: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "8px",
    backgroundColor: loginType === type ? "#4a67ff" : "rgba(255, 255, 255, 0.05)",
    color: loginType === type ? "#fff" : "#888",
    transition: "all 0.3s ease",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#121123", minHeight: "100vh" }}>
      
      {/* MAIN HERO CONTENT ROW */}
      <div
        className="sign-in-page-wrapper"
        style={{
          minHeight: "calc(100vh - 250px)", // Leaves room to cleanly hint at footer content below
          backgroundImage: "url('/homepage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "80px 40px 40px 40px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "20px", left: "20px" }}>
          <img src="/svLogo.png" alt="SignVision" style={{ height: "150px" }} />
        </div>

        {/* 2. LEFT HERO SECTION */}
        <div style={{ flex: "1", maxWidth: "500px", color: "#fff", zIndex: 2 }}>
          <h1 style={{ fontSize: "4.5rem", fontWeight: "800", margin: 0, lineHeight: "1.1" }}>
            SignVision
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255, 255, 255, 0.7)", marginTop: "20px", lineHeight: "1.6" }}>
            Empowering communication through innovative vision technology. 
            Sign in to access your personalized dashboard and bridge the gap.
          </p>
        </div>

        {/* 3. LOGIN CARD */}
        <div
          style={{
            flex: "0 1 420px",
            backgroundColor: "rgba(29, 29, 53, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            zIndex: 2
          }}
        >
          <div style={{ display: "flex", gap: "10px", marginBottom: "30px", background: "rgba(0,0,0,0.2)", padding: "5px", borderRadius: "10px" }}>
            <button type="button" style={getToggleStyle("INDIVIDUAL")} onClick={() => setLoginType("INDIVIDUAL")}>
              Individual
            </button>
            <button type="button" style={getToggleStyle("ORGANIZATION")} onClick={() => setLoginType("ORGANIZATION")}>
              Organization
            </button>
          </div>

          <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "30px", fontSize: "1.8rem" }}>Welcome Back</h2>

          <form onSubmit={onSubmit}>
            {loginType === "ORGANIZATION" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Organization ID</label>
                <input type="text" name="orgId" value={formData.orgId} onChange={handleChange} style={inputStyle} required />
              </div>
            )}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ color: "#aaa", fontSize: "0.85rem" }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#4a67ff",
                color: "#fff",
                padding: "14px",
                borderRadius: "10px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(74, 103, 255, 0.3)"
              }}
            >
              Sign In
            </button>
          </form>
                  <div style={{ marginTop: "30px", textAlign: "center" }}>
  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
    Don't have an account?{" "}
    <span
      style={{ color: "#4a67ff", cursor: "pointer", fontWeight: "bold" }}
      onClick={() => {
        // 🔥 Dynamic Redirect Logic
        if (loginType === "ORGANIZATION") {
          // If they click 'Create Account' while on the Organization tab, 
          // pass 'ORGANIZATION' state to the SignUp page
          navigate(VIEWS.SIGN_UP_TYPE, { state: { defaultType: "ORGANIZATION" } });
        } else {
          // Otherwise, pass 'INDIVIDUAL' state
          navigate(VIEWS.SIGN_UP_TYPE, { state: { defaultType: "INDIVIDUAL" } });
        }
      }}
    >
      Create Account
    </span>
  </p>
</div>
          
        </div>
      </div>

      {/* PROFESSIONAL FOOTER (About Us & Project Overview) */}
      <footer 
        ref={footerRef}
        style={{
          backgroundColor: "#161530",
          borderTop: "1px solid rgba(74, 103, 255, 0.2)",
          color: "#ffffff",
          padding: "50px 40px 30px 40px",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Project Details Column */}
          <div style={{ flex: "1 1 350px" }}>
            <h3 style={{ color: "#4a67ff", fontSize: "1.4rem", margin: "0 0 15px 0", fontWeight: "700" }}>About SignVision</h3>
            <p style={{ color: "#ccc", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
              SignVision is an advanced web intelligence platform dedicated to breaking structural communication gaps. 
              By leveraging camera feeds and computer vision architectures, our system tracks digital hand forms 
              and gestures, parsing complex sign syntax directly into spoken sentences or digital datasets in real time.
            </p>
          </div>

          {/* Core Pipeline / Specs Column */}
          <div style={{ flex: "1 1 250px" }}>
            <h3 style={{ color: "#4a67ff", fontSize: "1.1rem", margin: "0 0 15px 0", fontWeight: "700", letterSpacing: "0.5px" }}>PROJECT SPECS</h3>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0, color: "#ccc", fontSize: "0.9rem", lineHeight: "2" }}>
              <li>• Real-time Spatial Hand Tracking</li>
              <li>• Gamified Dynamic Quiz Mechanics</li>
              <li>• Instant Sign-to-Speech Processing</li>
              <li>• Scalable Organization Accounts</li>
            </ul>
          </div>

          {/* Corporate / Support Column */}
          <div style={{ flex: "1 1 200px" }}>
            <h3 style={{ color: "#4a67ff", fontSize: "1.1rem", margin: "0 0 15px 0", fontWeight: "700", letterSpacing: "0.5px" }}>NAVIGATION</h3>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0, color: "#ccc", fontSize: "0.9rem", lineHeight: "2" }}>
              <li style={{ cursor: "pointer", color: "#4a67ff" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to Top ↑</li>
              <li style={{ cursor: "not-allowed" }}>Privacy Policy</li>
              <li style={{ cursor: "not-allowed" }}>API Reference Docs</li>
              <li style={{ cursor: "not-allowed" }}>Contact Dev Team</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "40px", paddingTop: "20px", textAlign: "center", fontSize: "0.85rem", color: "#666" }}>
          © {new Date().getFullYear()} SignVision Systems. All software privileges and data translation rights protected.
        </div>
      </footer>

    </div>
  );
};

export default SignPage;