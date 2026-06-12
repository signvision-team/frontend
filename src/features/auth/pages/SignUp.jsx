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
    regNumber: "",
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
      email: formData.email.trim(),
      password: formData.password.trim(),
      address: formData.address.trim(),
      userType: registrationType,

      ...(registrationType === "INDIVIDUAL"
        ? {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            dob: finalDob
          }
        : {
            orgName: formData.orgName.trim(),
            regNumber: formData.regNumber.trim(),
            contactPerson: formData.contactPerson.trim(),
            contactNumber: formData.contactNumber.trim()
          })
    };

    try {
      const response = await handleSignUp(payload);

      if (response?.success) {
        if (registrationType === "ORGANIZATION") {
          alert(
            `🎉 Organization Registered Successfully!\n\nYour Organization ID:\n👉 ${
              response.organizationId || "NOT RECEIVED"
            }`
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
{/* HEADER */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 50px",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  }}
>

  {/* LOGO */}
  <div className="corner-logo-container">
    <img
      src={svLogo}
      alt="SignVision"
      style={{ height: "150px" }}
    />
  </div>

  {/* NAVBAR RIGHT SIDE */}
  <div
    style={{
      marginLeft: "auto",
      display: "flex",
      alignItems: "center"
    }}
  >
    <ul
      style={{
        display: "flex",
        alignItems: "center",
        gap: "35px",
        listStyle: "none",
        margin: 0,
        padding: 0
      }}
    >

      {/* HOME */}
      <li
        onClick={() => navigate(VIEWS.SIGN_IN)}
        style={{
          cursor: "pointer",
          color: "#ffffff",
          fontWeight: "600",
          fontSize: "1.05rem"
        }}
      >
        Home
      </li>

      {/* ABOUT US */}
      <li
        onClick={() => {
          navigate(VIEWS.SIGN_IN);

          setTimeout(() => {
            const footer =
              document.getElementById("footer");

            if (footer) {
              footer.scrollIntoView({
                behavior: "smooth"
              });
            }
          }, 300);
        }}
        style={{
          cursor: "pointer",
          color: "#ffffff",
          fontWeight: "600",
          fontSize: "1.05rem"
        }}
      >
        About Us
      </li>

    </ul>
  </div>
</div>
      {/* HERO SECTION */}
      <div
        className="hero-section"
        style={{
          paddingTop: "50px",
          paddingBottom: "40px"
        }}
      >
        <div
          className="card-common account-card"
          style={{
            maxWidth: "500px",
            margin: "0 auto"
          }}
        >

          {/* TOGGLE BUTTONS */}
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

          <h2
            className="account-title"
            style={{ marginBottom: "20px" }}
          >
            {registrationType === "INDIVIDUAL"
              ? "Create Account"
              : "Organization Registry"}
          </h2>

          <form
            onSubmit={onSubmit}
            style={{
              width: "100%",
              textAlign: "left"
            }}
          >

            {/* INDIVIDUAL FIELDS */}
            {registrationType === "INDIVIDUAL" && (
              <>
                <div className="input-field">
                  <label>First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="input-field">
                  <label>Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="input-field">
                  <label>Phone Number</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="input-field">
                  <label>Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>
              </>
            )}

            {/* ORGANIZATION FIELDS */}
            {registrationType === "ORGANIZATION" && (
              <>
                <div className="input-field">
                  <label>Organization Name</label>
                  <input
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="input-field">
                  <label>Organization Registration Number</label>
                  <input
                    name="regNumber"
                    placeholder="e.g. REG-12345"
                    value={formData.regNumber}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="input-field">
                  <label>Contact Person</label>
                  <input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>

                <div className="input-field">
                  <label>Contact Number</label>
                  <input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  />
                </div>
              </>
            )}

            {/* COMMON FIELDS */}
            <div className="input-field">
              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div className="input-field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div className="input-field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div className="input-field">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <button
              type="submit"
              className="cta-button"
              style={buttonStyle}
            >
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
  backgroundColor: isActive
    ? "#4a67ff"
    : "rgba(255,255,255,0.1)",
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