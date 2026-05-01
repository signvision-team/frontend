import React, { useState } from "react";
import svLogo from "../../../assets/svLogo.png";

const SignUp = ({ navigate, VIEWS, setUserType, handleSignUp }) => {
  const [registrationType, setRegistrationType] = useState("INDIVIDUAL");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    orgName: "",
    contactPerson: "",
    contactNumber: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let finalDob = formData.dob;

    if (registrationType === "INDIVIDUAL" && finalDob.includes("/")) {
      const [day, month, year] = finalDob.split("/");
      finalDob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const payload = {
      ...formData,
      dob: finalDob,
      userType: registrationType
    };

    try {
      const response = await handleSignUp(payload);

      // ✅ IMPORTANT: backend must return object
      if (response?.success) {
        if (registrationType === "ORGANIZATION") {
          alert(
            `🎉 Organization Registered Successfully!\n\nYour Organization ID:\n👉 ${response.organizationId || "NOT RECEIVED"}`
          );
        } else {
          alert("🎉 Account created successfully!");
        }

        navigate(VIEWS.SIGN_IN);
      } else {
        alert(response?.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error during signup");
    }
  };

  return (
    <div className="landing-page-wrapper">

      <div className="corner-logo-container">
        <img src={svLogo} alt="SignVision" style={{ height: "150px" }} />
      </div>

      <div className="navbar">
        <ul className="navbar-links">
          <li onClick={() => navigate(VIEWS.SIGN_IN)} style={{ cursor: "pointer" }}>
            Home
          </li>
          <li>Services</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
      </div>

      <div className="hero-section" style={{ paddingTop: "50px", paddingBottom: "40px" }}>
        <div className="card-common account-card" style={{ maxWidth: "500px", margin: "0 auto" }}>

          {/* Toggle */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "25px",
              background: "rgba(0,0,0,0.2)",
              padding: "5px",
              borderRadius: "10px"
            }}
          >
            <button
              type="button"
              style={toggleButtonStyle(registrationType === "INDIVIDUAL")}
              onClick={() => setRegistrationType("INDIVIDUAL")}
            >
              Individual
            </button>

            <button
              type="button"
              style={toggleButtonStyle(registrationType === "ORGANIZATION")}
              onClick={() => setRegistrationType("ORGANIZATION")}
            >
              Organization
            </button>
          </div>

          <h2 className="account-title" style={{ marginBottom: "20px" }}>
            {registrationType === "INDIVIDUAL"
              ? "Create Account"
              : "Organization Registry"}
          </h2>

          <form onSubmit={onSubmit} style={{ width: "100%", textAlign: "left" }}>

            {registrationType === "INDIVIDUAL" && (
              <>
                <div className="input-field">
                  <label>First Name</label>
                  <input name="firstName" onChange={handleChange} required className="admin-input" />
                </div>

                <div className="input-field">
                  <label>Last Name</label>
                  <input name="lastName" onChange={handleChange} required className="admin-input" />
                </div>

                <div className="input-field">
                  <label>Phone Number</label>
                  <input name="phoneNumber" onChange={handleChange} required className="admin-input" />
                </div>

                <div className="input-field">
                  <label>Date of Birth</label>
                  <input name="dob" type="date" onChange={handleChange} required className="admin-input" />
                </div>
              </>
            )}

            {registrationType === "ORGANIZATION" && (
              <>
                <div className="input-field">
                  <label>Organization Name</label>
                  <input name="orgName" onChange={handleChange} required className="admin-input" />
                </div>

                <div className="input-field">
                  <label>Contact Person</label>
                  <input name="contactPerson" onChange={handleChange} required className="admin-input" />
                </div>

                <div className="input-field">
                  <label>Contact Number</label>
                  <input name="contactNumber" onChange={handleChange} required className="admin-input" />
                </div>
              </>
            )}

            <div className="input-field">
              <label>Address</label>
              <input name="address" onChange={handleChange} required className="admin-input" />
            </div>

            <div className="input-field">
              <label>Email</label>
              <input name="email" type="email" onChange={handleChange} required className="admin-input" />
            </div>

            <div className="input-field">
              <label>Password</label>
              <input name="password" type="password" onChange={handleChange} required className="admin-input" />
            </div>

            <div className="input-field">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" onChange={handleChange} required className="admin-input" />
            </div>

            <button type="submit" className="cta-button" style={buttonStyle}>
              {registrationType === "INDIVIDUAL"
                ? "Sign Up"
                : "Register Organization"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

const toggleButtonStyle = (isActive) => ({
  flex: 1,
  padding: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  borderRadius: "8px",
  backgroundColor: isActive ? "#4a67ff" : "rgba(255,255,255,0.1)",
  color: isActive ? "#fff" : "#ccc"
});

const buttonStyle = {
  width: "50%",
  backgroundColor: "#4a67ff",
  color: "#fff",
  padding: "10px",
  borderRadius: "16px",
  fontWeight: "bold",
  marginTop: "10px",
  cursor: "pointer",
  border: "none",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto"
};

export default SignUp;