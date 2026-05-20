import React, { useState } from "react";

const IndividualSettings = () => {
  const [formData, setFormData] = useState({
    firstName:
      localStorage.getItem("firstName") || "",
    lastName:
      localStorage.getItem("lastName") || "",
    email:
      localStorage.getItem("email") || "",
    phoneNumber: "",
    learningGoal: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (
      formData.newPassword &&
      formData.newPassword !==
        formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    alert("Settings Updated Successfully");
  };

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #121223, #0d0d18)",
        color: "#fff",
        fontFamily: "sans-serif"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          marginBottom: "40px"
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "10px"
          }}
        >
          Account Settings
        </h1>

        <p
          style={{
            color: "#9ca3af"
          }}
        >
          Manage your profile, security,
          and SignVision learning preferences.
        </p>
      </div>

      {/* MAIN CARD */}
      <div
        style={{
          background:
            "rgba(20,20,35,0.96)",
          border:
            "1px solid rgba(74,103,255,0.18)",
          borderRadius: "22px",
          padding: "35px",
          maxWidth: "900px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.45)"
        }}
      >

        {/* PROFILE SECTION */}
        <h2
          style={{
            color: "#4a67ff",
            marginBottom: "25px"
          }}
        >
          Personal Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "22px"
          }}
        >

          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <InputField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* LEARNING GOALS */}
        <div
          style={{
            marginTop: "30px"
          }}
        >
          <label
            style={{
              color: "#9ca3af",
              fontSize: "0.9rem"
            }}
          >
            Learning Goals
          </label>

          <textarea
            name="learningGoal"
            value={formData.learningGoal}
            onChange={handleChange}
            rows="4"
            placeholder="Write your sign language learning goals..."
            style={{
              width: "100%",
              marginTop: "10px",
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "15px",
              color: "#fff",
              resize: "none",
              outline: "none"
            }}
          />
        </div>

        {/* SECURITY */}
        <div
          style={{
            marginTop: "45px"
          }}
        >
          <h2
            style={{
              color: "#4a67ff",
              marginBottom: "25px"
            }}
          >
            Security Settings
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "22px"
            }}
          >

            <InputField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={
                formData.currentPassword
              }
              onChange={handleChange}
            />

            <div />

            <InputField
              label="New Password"
              name="newPassword"
              type="password"
              value={
                formData.newPassword
              }
              onChange={handleChange}
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
            />
          </div>
        </div>

        {/* PROGRESS INSIGHT */}
        <div
          style={{
            marginTop: "45px",
            padding: "22px",
            background:
              "rgba(74,103,255,0.08)",
            borderRadius: "16px",
            border:
              "1px solid rgba(74,103,255,0.15)"
          }}
        >
          <h3
            style={{
              color: "#4a67ff",
              marginBottom: "10px"
            }}
          >
            Learning Insights
          </h3>

          <p
            style={{
              color: "#c7c7d1",
              lineHeight: "1.7"
            }}
          >
            Continue practicing gesture
            recognition exercises and
            interactive quizzes to improve
            real-time sign translation
            accuracy and fluency.
          </p>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          style={{
            marginTop: "35px",
            backgroundColor: "#4a67ff",
            color: "#fff",
            border: "none",
            padding:
              "14px 28px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            boxShadow:
              "0 10px 25px rgba(74,103,255,0.3)"
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text"
}) => (
  <div>
    <label
      style={{
        color: "#9ca3af",
        fontSize: "0.9rem"
      }}
    >
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        marginTop: "10px",
        background:
          "rgba(255,255,255,0.03)",
        border:
          "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "14px",
        color: "#fff",
        outline: "none"
      }}
    />
  </div>
);

export default IndividualSettings;