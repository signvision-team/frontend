// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import Card from "./Card";
import { cache } from "../api/cache";
import { updateUserProfile } from "../api/authApi";

const SettingsPage = ({ navigate, userData, onLogOut, onUserUpdate }) => {
  const userId = userData?.id || userData?.user_id;

  // Local state management
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ FIX: Initialize inputs directly from data. No infinity-looping useEffect hooks!
  const [name, setName] = useState(() => userData?.name || userData?.username || "");
  const [email, setEmail] = useState(() => userData?.email || "");

  const handleSignOut = () => {
    try {
      if (userId) {
        cache.invalidate(`chapters_${userId}`);
        cache.invalidate(`progress_${userId}`);
        cache.invalidate(`xp_${userId}`);
        cache.invalidate(`streak_${userId}`);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
      sessionStorage.clear();
      if (onLogOut) onLogOut();
      navigate("MAIN_MENU");
    } catch (error) {
      console.error("Error executing clean sign-out sequence:", error);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!userId) {
      setErrorMessage("User session identification lost. Please log in again.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setErrorMessage("Please enter a valid Name and Email address.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const activeToken = localStorage.getItem("token");
      const result = await updateUserProfile(userId, { name: trimmedName, email: trimmedEmail }, activeToken);

      if (!result.success) {
        throw new Error(result.message || "Database rejected modifications.");
      }

      cache.invalidate(`chapters_${userId}`);
      cache.invalidate(`progress_${userId}`);

      if (onUserUpdate) {
        onUserUpdate(result.user || { ...userData, name: trimmedName, email: trimmedEmail }); 
      }

      setSuccessMessage("Profile saved to database successfully!");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile modification process aborted:", error);
      setErrorMessage(error.message || "Could not connect to database. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormUnchanged = name.trim() === (userData?.name || userData?.username || "") && 
                          email.trim() === (userData?.email || "");

  return (
    <Card>
      <h2>Settings</h2>
      <p className="subtitle">
        Manage your account and application preferences.
      </p>

      {/* Account Details Panel */}
      <div className="settings-card">
        <h3>Account Details</h3>
        
        {errorMessage && <p style={{ color: "#ef4444", fontSize: "0.9rem", margin: "8px 0", fontWeight: "500" }}>⚠️ {errorMessage}</p>}
        {successMessage && <p style={{ color: "#22c55e", fontSize: "0.9rem", margin: "8px 0", fontWeight: "500" }}>✅ {successMessage}</p>}

        {!isEditingProfile ? (
          <div>
            <p><strong>Name:</strong> {userData?.name || userData?.username || "Not Set"}</p>
            <p><strong>Email:</strong> {userData?.email || "Not Set"}</p>
            <button 
              className="btn secondary" 
              style={{ marginTop: "12px", padding: "6px 14px", fontSize: "0.85rem" }}
              onClick={() => {
                setErrorMessage("");
                setSuccessMessage("");
                // Set explicitly when opening the editing box
                setName(userData?.name || userData?.username || "");
                setEmail(userData?.email || "");
                setIsEditingProfile(true);
              }}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveChanges} style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px", color: "#666" }}>Display Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter new name"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
                disabled={isSaving}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px", color: "#666" }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter new email"
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
                disabled={isSaving}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button 
                type="submit" 
                className="btn primary"
                disabled={isSaving || !name.trim() || !email.trim() || isFormUnchanged}
                style={{ opacity: (isSaving || !name.trim() || !email.trim() || isFormUnchanged) ? 0.6 : 1 }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                className="btn secondary"
                onClick={() => {
                  setIsEditingProfile(false);
                  setErrorMessage("");
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Notifications Panel */}
      <div className="settings-card">
        <h3>Notifications</h3>
        <p>Adjust alerts for new lessons and practice reminders.</p>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", cursor: "pointer", fontSize: "0.95rem" }}>
          <input 
            type="checkbox" 
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
          Enable practice reminders
        </label>
      </div>

      <div style={{ marginTop: "28px" }}>
        <button className="btn secondary" onClick={handleSignOut}>
          Log Out
        </button>
      </div>

      <p className="back" onClick={() => navigate("DASHBOARD")} style={{ cursor: "pointer", marginTop: "20px" }}>
        ← Back to Dashboard
      </p>
    </Card>
  );
};

export default SettingsPage;