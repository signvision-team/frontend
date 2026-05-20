import React, { useState } from "react";
import svLogo from "../../../assets/svLogo.png";

const SignUp = ({ navigate, VIEWS, setUserType, handleSignUp }) => {

  const [registrationType, setRegistrationType] = useState("INDIVIDUAL");

  const [showOrgPopup, setShowOrgPopup] = useState(false);
  const [generatedOrgID, setGeneratedOrgID] = useState("");

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let finalDob = formData.dob;

    if (
      registrationType === "INDIVIDUAL" &&
      finalDob.includes("/")
    ) {
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

        const orgID =
          response?.orgID ||
          response?.organizationId ||
          null;

        // ✅ ORGANIZATION SUCCESS
        if (registrationType === "ORGANIZATION") {

          setGeneratedOrgID(orgID || "NOT RECEIVED");

          setShowOrgPopup(true);

          // ✅ Auto copy
          if (orgID) {
            await navigator.clipboard.writeText(orgID);
          }

        } else {

          // ✅ INDIVIDUAL SUCCESS
          alert("🎉 Account created successfully!");

          navigate(VIEWS.SIGN_IN);
        }

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

      {/* LOGO */}
      <div className="corner-logo-container">
        <img
          src={svLogo}
          alt="SignVision"
          style={{ height: "150px" }}
        />
      </div>

      {/* NAVBAR */}
      <div className="navbar">

        <ul className="navbar-links">

          <li
            onClick={() => navigate(VIEWS.SIGN_IN)}
            style={{ cursor: "pointer" }}
          >
            Home
          </li>

          <li
            style={{
              opacity: 0.5,
              cursor: "not-allowed"
            }}
          >
            Services
          </li>

          <li
            onClick={() =>
              navigate(VIEWS.SIGN_IN, {
                state: { scrollTo: "about" }
              })
            }
            style={{ cursor: "pointer" }}
          >
            About Us
          </li>

          <li
            onClick={() =>
              navigate(VIEWS.SIGN_IN, {
                state: { scrollTo: "contact" }
              })
            }
            style={{ cursor: "pointer" }}
          >
            Contact
          </li>

        </ul>

      </div>

      {/* MAIN SECTION */}
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

          {/* TOGGLE */}
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
              style={toggleButtonStyle(
                registrationType === "INDIVIDUAL"
              )}
              onClick={() =>
                setRegistrationType("INDIVIDUAL")
              }
            >
              Individual
            </button>

            <button
              type="button"
              style={toggleButtonStyle(
                registrationType === "ORGANIZATION"
              )}
              onClick={() =>
                setRegistrationType("ORGANIZATION")
              }
            >
              Organization
            </button>

          </div>

          {/* TITLE */}
          <h2
            className="account-title"
            style={{ marginBottom: "20px" }}
          >
            {registrationType === "INDIVIDUAL"
              ? "Create Account"
              : "Organization Registry"}
          </h2>

          {/* FORM */}
          <form
            onSubmit={onSubmit}
            style={{
              width: "100%",
              textAlign: "left"
            }}
          >

            {/* INDIVIDUAL */}
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

            {/* ORGANIZATION */}
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
                  <label>
                    Organization Registration Number
                  </label>

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

            {/* BUTTON */}
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

      {/* ✅ ORG ID POPUP */}
      {showOrgPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >

          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "15px",
              width: "350px",
              textAlign: "center"
            }}
          >

            <h2
              style={{
                marginBottom: "15px",
                color: "#333"
              }}
            >
              🎉 Organization Registered
            </h2>

            <p
              style={{
                marginBottom: "10px",
                color: "#555"
              }}
            >
              Your Organization ID:
            </p>

            <div
              style={{
                background: "#f1f1f1",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
                marginBottom: "20px",
                fontSize: "18px"
              }}
            >
              {generatedOrgID}
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#777",
                marginBottom: "20px"
              }}
            >
              ID copied to clipboard automatically
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px"
              }}
            >

              {/* COPY BUTTON */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    generatedOrgID
                  );

                  alert("Organization ID copied!");
                }}
                style={{
                  padding: "10px 18px",
                  background: "#4a67ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Copy ID
              </button>

              {/* CONTINUE BUTTON */}
              <button
                onClick={() => {
                  setShowOrgPopup(false);

                  navigate(VIEWS.SIGN_IN);
                }}
                style={{
                  padding: "10px 18px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Continue
              </button>

            </div>

          </div>

        </div>
      )}

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