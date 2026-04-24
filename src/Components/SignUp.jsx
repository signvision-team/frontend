import React, { useState } from "react";

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
    if (registrationType === "INDIVIDUAL" && finalDob) {
      if (finalDob.includes('/')) {
        const [day, month, year] = finalDob.split('/');
        finalDob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    if (setUserType) setUserType(registrationType);

    const payload = { 
      ...formData, 
      dob: finalDob, 
      userType: registrationType 
    };

    const success = await handleSignUp(payload);
    if (success) {
      alert("Account created successfully!");
      navigate(VIEWS.SIGN_IN); 
    }
  };

  return (
    <div className="landing-page-wrapper">
      <div className="corner-logo-container">
        <img src="/svLogo.png" alt="SignVision" style={{ height: '150px' }} />
      </div>

      <div className="navbar">
        <ul className="navbar-links">
          <li onClick={() => navigate(VIEWS.SIGN_IN)} style={{ cursor: "pointer" }}>Home</li>
          <li>Services</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
      </div>

      <div className="hero-section" style={{ paddingTop: '50px', paddingBottom: '40px' }}>
        <div className="card-common account-card" style={{ maxWidth: '500px', margin: "0 auto" }}>

          <div style={{ display: "flex", gap: "10px", marginBottom: "25px", background: "rgba(0,0,0,0.2)", padding: "5px", borderRadius: "10px" }}>
            <button type="button" style={toggleButtonStyle(registrationType === "INDIVIDUAL")} onClick={() => setRegistrationType("INDIVIDUAL")}>
              Individual
            </button>
            <button type="button" style={toggleButtonStyle(registrationType === "ORGANIZATION")} onClick={() => setRegistrationType("ORGANIZATION")}>
              Organization
            </button>
          </div>

          <h2 className="account-title" style={{ marginBottom: "20px" }}>
            {registrationType === "INDIVIDUAL" ? "Create Account" : "Organization Registry"}
          </h2>

          <form onSubmit={onSubmit} style={{ width: '100%', textAlign: 'left' }}>
            {registrationType === "INDIVIDUAL" && (
              <>
                <div className="input-field">
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" type="text" name="firstName" autoComplete="given-name" onChange={handleChange} required className="admin-input" />
                </div>
                <div className="input-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" type="text" name="lastName" autoComplete="family-name" onChange={handleChange} required className="admin-input" />
                </div>
               
                <div className="input-field">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input id="phoneNumber" type="tel" name="phoneNumber" autoComplete="tel" onChange={handleChange} required className="admin-input" />
                </div>
                <div className="input-field">
                  <label htmlFor="dob">Date of Birth</label>
                  <input id="dob" type="date" name="dob" onChange={handleChange} required className="admin-input" />
                </div>
              </>
            )}

            {registrationType === "ORGANIZATION" && (
              <>
                <div className="input-field">
                  <label htmlFor="orgName">Organization Name</label>
                  <input id="orgName" type="text" name="orgName" autoComplete="organization" onChange={handleChange} required className="admin-input" />
                </div>
                <div className="input-field">
                  <label htmlFor="contactPerson">Contact Person</label>
                  <input id="contactPerson" type="text" name="contactPerson" autoComplete="name" onChange={handleChange} required className="admin-input" />
                </div>
                
                <div className="input-field">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input id="contactNumber" type="tel" name="contactNumber" autoComplete="tel" onChange={handleChange} required className="admin-input" />
                </div>
              </>
            )}

            <div className="input-field">
              <label htmlFor="address">{registrationType === "ORGANIZATION" ? "Office Address" : "Home Address"}</label>
              <input id="address" type="text" name="address" autoComplete="street-address" onChange={handleChange} required className="admin-input" />
            </div>
             <div className="input-field">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" name="email" autoComplete="email" onChange={handleChange} required className="admin-input" />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" name="password" autoComplete="new-password" onChange={handleChange} required className="admin-input" />
            </div>
            <div className="input-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" name="confirmPassword" autoComplete="new-password" onChange={handleChange} required className="admin-input" />
            </div>

            <button type="submit" className="cta-button" style={{ width: "50%", backgroundColor: "#4a67ff", color: "#fff", padding: "10px", borderRadius: "16px", fontWeight: "bold", marginTop: "10px auto", cursor: "pointer", border: "none", display: "block", marginLeft: "auto", marginRight: "auto" }}>
              {registrationType === "INDIVIDUAL" ? "Sign Up" : "Register Organization"}
            </button>
          </form>

          <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#e0e0e0', textAlign: 'center' }}>
            <p>
              Already have an account?{" "}
              <span className="link-text" style={{ cursor: "pointer", fontWeight: "bold", color: "#4a67ff" }} onClick={() => navigate(VIEWS.SIGN_IN)}>
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const toggleButtonStyle = (isActive) => ({
  flex: 1, padding: "10px", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "8px",
  backgroundColor: isActive ? "#4a67ff" : "rgba(255,255,255,0.1)",
  color: isActive ? "#fff" : "#ccc", transition: "all 0.3s ease"
});

export default SignUp;

