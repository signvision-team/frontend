import React, { useState, useEffect } from "react";

// Pages
import SignPage from "./features/auth/pages/SignPage.jsx";
import SignUp from "./features/auth/pages/SignUp.jsx";
import Dashboard from "./features/dashboard/pages/Dashboard.jsx";

// API
import { loginUser, signupUser } from "./api/authService.js";

import "./App.css";

const VIEWS = {
  SIGN_IN: "SIGN_IN",
  SIGN_UP_TYPE: "SIGN_UP_TYPE",
  DASHBOARD: "DASHBOARD",
  DETECTION: "DETECTION",
  LEARN: "LEARN",
  PROGRESS: "PROGRESS",
  SETTINGS: "SETTINGS",
  MEMBERS: "MEMBERS",
  ADD_USER: "ADD_USER",
  ISSUES: "ISSUES",
  ANALYTICS: "ANALYTICS",
};

const App = () => {
  const [currentView, setCurrentView] = useState(VIEWS.SIGN_IN);
  const [userType, setUserType] = useState("INDIVIDUAL");

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [orgId, setOrgId] = useState(null);

  const navigate = (view) => setCurrentView(view);

  // =========================
  // AUTO LOGIN (DISABLED)
  // =========================
  useEffect(() => {
    setCurrentView(VIEWS.SIGN_IN);
  }, []);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (formData) => {
    try {
      const data = await loginUser(formData);

      if (data.success) {
        const user = data.user;

        setUserData(user);

        // ✅ FIXED: always trust form OR backend (no fallback bug)
        const type = (user.userType || "").toUpperCase();

    const allowedTypes = ["INDIVIDUAL", "ORGANIZATION"];
const finalType = allowedTypes.includes(type) ? type : "INDIVIDUAL";

setUserType(finalType);

        setToken(data.token);

        // ✅ FIXED: consistent orgId handling
    const organizationId =
  finalType === "ORGANIZATION"
    ? (user.orgId ||
       user.orgID ||
       user.organizationId ||
       data.orgId ||
       null)
    : null;

        setOrgId(organizationId);

        setCurrentView(VIEWS.DASHBOARD);
        return true;
      }

      alert(data.message || "Login failed");
      return false;
    } catch (error) {
      console.error(error);
      alert("Server error");
      return false;
    }
  };

  // =========================
  // SIGNUP (UNCHANGED)
  // =========================
  const handleSignUp = async (formData) => {
    try {
      const data = await signupUser(formData);

      if (data.success) {
        if (formData.userType === "ORGANIZATION" && data.orgId) {
          alert(`Organization created successfully!\nYour Org ID: ${data.orgId}`);
        } else {
          alert("Signup successful!");
        }

        setCurrentView(VIEWS.SIGN_IN);
        return true;
      }

      alert(data.message || "Signup failed");
      return false;
    } catch (error) {
      console.error(error);
      alert("Server error");
      return false;
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    setUserData(null);
    setToken(null);
    setOrgId(null);
    setUserType("INDIVIDUAL");

    setCurrentView(VIEWS.SIGN_IN);
  };

  // =========================
  // ROUTER
  // =========================
  const renderView = () => {
    switch (currentView) {
      case VIEWS.SIGN_IN:
        return (
          <SignPage
            navigate={navigate}
            VIEWS={VIEWS}
            handleLogin={handleLogin}
          />
        );

      case VIEWS.SIGN_UP_TYPE:
        return (
          <SignUp
            navigate={navigate}
            VIEWS={VIEWS}
            handleSignUp={handleSignUp}
          />
        );

      case VIEWS.DASHBOARD:
      case VIEWS.DETECTION:
      case VIEWS.LEARN:
      case VIEWS.PROGRESS:
      case VIEWS.SETTINGS:
      case VIEWS.MEMBERS:
      case VIEWS.ADD_USER:
      case VIEWS.ISSUES:
      case VIEWS.ANALYTICS:
        return (
          <Dashboard
            navigate={navigate}
            currentView={currentView}
            userType={userType}
            userData={userData}
            token={token}
            orgId={orgId}
            onLogout={handleLogout}
            VIEWS={VIEWS}
          />
        );

      default:
        return (
          <SignPage
            navigate={navigate}
            VIEWS={VIEWS}
            handleLogin={handleLogin}
          />
        );
    }
  };

  return <div className="app-global-container">{renderView()}</div>;
};

export default App;
