import React, { useState } from "react";
import svLogo from "../assets/svLogo.png"; // ✅ FIXED: import from assets

const SignUp = ({ navigate, VIEWS }) => {
  const [formData, setFormData] = useState({
    orgName: "",
    contactPerson: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Organization Registration Data:", formData);
    navigate(VIEWS.DASHBOARD);
  };

  return (
    <div className="sign-in-page-wrapper">

      {/* CORNER LOGO (Top Left) */}
      <div className="corner-logo-container">
        <img src={svLogo} alt="SignVision" style={{ height: '50px' }} />
      </div>

      {/* Navbar */}
      <div className="navbar">
        <div></div>
        <ul className="navbar-links">
          <li onClick={() => navigate(VIEWS.LANDING)}>Home</li>
          <li>Services</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="hero-section" style={{ paddingTop: '50px', paddingBottom: '30px' }}>

        <div className="card-common form-reg-card">

          <h2>Organization Registration</h2>

          <form onSubmit={handleRegister} style={{ width: '100%' }}>

            <div className="form-group">
              <label>Organization Name</label>
              <input type="text" name="orgName" placeholder="Enter Organization Name" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Contact Person</label>
              <input type="text" name="contactPerson" placeholder="Enter Contact Person" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Official Email</label>
              <input type="email" name="email" placeholder="Enter Official Email" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Office Address</label>
              <input type="text" name="address" placeholder="Enter Office Address" onChange={handleChange} required />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Password</label>
                <input type="password" name="password" placeholder="Create Password" onChange={handleChange} required />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Confirm</label>
                <input type="password" name="confirmPassword" placeholder="Confirm" onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              Register Organization
            </button>

          </form>

          <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#e0e0e0' }}>
            <p style={{ margin: 0 }}>
              Already have an account?{" "}
              <span className="link-text" onClick={() => navigate(VIEWS.SignPage)}>
                Sign In
              </span>
            </p>

            <p style={{ marginTop: '5px', cursor: 'pointer' }} className="link-text"
              onClick={() => navigate(VIEWS.SIGN_UP_TYPE)}>
              ← Back to Selection
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;