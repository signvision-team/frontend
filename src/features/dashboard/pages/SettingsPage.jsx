import React from "react";
import Card from "./Card";

const SettingsPage = ({ navigate }) => {
  return (
    <Card>
      <h2>Settings</h2>
      <p className="subtitle">
        Manage your account and application preferences.
      </p>

      <div className="settings-card">
        <h3>Account Details</h3>
        <p>Update name, email, and password.</p>
      </div>

      <div className="settings-card">
        <h3>Notifications</h3>
        <p>Adjust alerts for new lessons and practice reminders.</p>
      </div>

      <div className="settings-card">
        <h3>Sign Out</h3>
      </div>

      <button className="btn secondary" onClick={() => navigate("MAIN_MENU")}>
        Log Out
      </button>

      <p className="back" onClick={() => navigate("DASHBOARD")}>
        ← Back to Dashboard
      </p>
    </Card>
  );
};

export default SettingsPage;