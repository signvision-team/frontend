import React, { useState } from "react";

const OrganizationSettings = () => {
  const [formData, setFormData] = useState({
    organizationName:
      localStorage.getItem("orgName") || "",
    organizationId:
      localStorage.getItem("orgId") || "",
    email:
      localStorage.getItem("email") || "",
    contactNumber: "",
    address: "",
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

      {/* PAGE TITLE */}
      <div
        style={{
          marginBottom: "40px"
        }}
      >
        <h1
          style={{
            fontSize: "2.4rem",
            marginBottom: "10px"
          }}
        >
          Organization Settings
        </h1>

        <p
          style={{
            color: "#9ca3af"
          }}
        >
          Manage organization profile,
          credentials and platform
          preferences.
        </p>
      </div>

      {/* SETTINGS CARD */}
      <div
        style={{
          background:
            "rgba(20,20,35,0.95)",
          border:
            "1px solid rgba(74,103,255,0.2)",
          borderRadius: "20px",
          padding: "35px",
          maxWidth: "850px",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.4)"
        }}
      >

        {/* ORGANIZATION INFO */}
        <h2
          style={{
            marginBottom: "25px",
            color: "#4a67ff"
          }}
        >
          Organization Profile
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px"
          }}
        >

          <InputField
            label="Organization Name"
            name="organizationName"
            value={
              formData.organizationName
            }
            onChange={handleChange}
          />

          <InputField
            label="Organization ID"
            name="organizationId"
            value={
              formData.organizationId
            }
            onChange={handleChange}
            disabled
          />

          <InputField
            label="Organization Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <InputField
            label="Contact Number"
            name="contactNumber"
            value={
              formData.contactNumber
            }
            onChange={handleChange}
          />
        </div>

        {/* ADDRESS */}
        <div
          style={{
            marginTop: "20px"
          }}
        >
          <label
            style={{
              color: "#9ca3af",
              fontSize: "0.9rem"
            }}
          >
            Organization Address
          </label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
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
              resize: "none",
              outline: "none"
            }}
          />
        </div>

        {/* PASSWORD SECTION */}
        <div
          style={{
            marginTop: "45px"
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
              color: "#4a67ff"
            }}
          >
            Security Settings
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "20px"
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

        {/* SYSTEM INFO */}
        <div
          style={{
            marginTop: "45px",
            padding: "20px",
            background:
              "rgba(74,103,255,0.08)",
            borderRadius: "16px",
            border:
              "1px solid rgba(74,103,255,0.15)"
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: "#4a67ff"
            }}
          >
            AI System Status
          </h3>

          <p
            style={{
              color: "#c7c7d1",
              lineHeight: "1.7"
            }}
          >
            SignVision AI translation
            services, gesture tracking,
            and organization systems
            are currently operational.
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
  type = "text",
  disabled = false
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
      disabled={disabled}
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
        outline: "none",
        opacity: disabled ? 0.7 : 1
      }}
    />
  </div>
);

export default OrganizationSettings;