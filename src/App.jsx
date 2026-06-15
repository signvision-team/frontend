import React, { useState, useEffect } from "react";

// Pages
import SignPage   from "./features/auth/pages/SignPage.jsx";
import SignUp     from "./features/auth/pages/SignUp.jsx";
import Dashboard  from "./features/dashboard/pages/Dashboard.jsx";

// NEW: Chapter detail page (copy from the zip into src/pages/)
import ChapterDetailPage from "./features/learning/pages/ChapterDetailPage.jsx";

// API
import { loginUser, signupUser } from "./api/authService.js";

// NEW: streak update on login
import { updateStreak } from "./api/gamificationApi.js";

import "./App.css";

const VIEWS = {
  SIGN_IN:        "SIGN_IN",
  SIGN_UP_TYPE:   "SIGN_UP_TYPE",
  DASHBOARD:      "DASHBOARD",
  DETECTION:      "DETECTION",
  LEARN:          "LEARN",
  PROGRESS:       "PROGRESS",
  SETTINGS:       "SETTINGS",
  MEMBERS:        "MEMBERS",
  ADD_USER:       "ADD_USER",
  ISSUES:         "ISSUES",
  ANALYTICS:      "ANALYTICS",
  LEADERBOARD:    "LEADERBOARD",    // ← NEW
  CHAPTER_DETAIL: "CHAPTER_DETAIL", // ← NEW
};

const App = () => {
  const [currentView, setCurrentView] = useState(VIEWS.SIGN_IN);
  const [userType, setUserType]       = useState("INDIVIDUAL");
  const [userData, setUserData]       = useState(null);
  const [token, setToken]             = useState(null);
  const [orgId, setOrgId]             = useState(null);

  // NEW: stores extra data when navigating (e.g. which chapter to open)
  const [navState, setNavState] = useState(null);

  // Updated navigate — accepts optional extra data
  // Usage: navigate("CHAPTER_DETAIL", { chapterId: 1 })
  const navigate = (view, state = null) => {
    setNavState(state);
    setCurrentView(view);
  };

  // =========================
  // AUTO LOGIN (DISABLED)
  // =========================
  useEffect(() => {
    setCurrentView(VIEWS.SIGN_IN);
  }, []);

 // =========================
  // LOGIN (FIXED REFERENCE RETURN)
  // =========================
  const handleLogin = async (formData) => {
    try {
      const data = await loginUser(formData);

      if (data.success) {
        const user = data.user;

        setUserData(user);

        const type =
          user.userType ||
          formData?.userType ||
          "INDIVIDUAL";

        setUserType(type);
        setToken(data.token);

        const organizationId =
          (type === "ORGANIZATION" || formData?.userType === "ORGANIZATION")
            ? (user.orgId || user.orgID || user.organizationId || data.orgId || null)
            : null;

        setOrgId(organizationId);

        // Update streak silently on login
        updateStreak(user.id).catch(() => {});

        setCurrentView(VIEWS.DASHBOARD);
        
        // ✅ FIX: Return the original response object so SignPage can read result.success
        return data; 
      }

      // ✅ FIX: Removed the alert from here to let SignPage handle UI messages uniquely
      return data;
    } catch (error) {
      console.error("Core login handling crash:", error);
      return { success: false, message: "Server connection timed out." };
    }
  };
  // =========================
  // SIGNUP (UNCHANGED)
  // =========================
 // ==========================================
  // SIGNUP (FIXED OBJECT PASS-THROUGH)
  // ==========================================
  const handleSignUp = async (formData) => {
    try {
      const data = await signupUser(formData);

      if (data && data.success) {
        // Automatically sync system view layout upon background success
        setCurrentView(VIEWS.SIGN_IN);
        
        // ✅ FIX: Pass the whole object back so SignUp.jsx can read the orgID
        return data; 
      }

      // Pass along failing backend message payloads safely
      return data || { success: false, message: "Registration rejected by database." };
    } catch (error) {
      console.error("Core signup handling crash:", error);
      return { success: false, message: "Server communication lost during creation pass." };
    }
  };
 // =========================
  // LOGOUT (DEEP PURGE)
  // =========================
  const handleLogout = () => {
    // 1. Clear memory states immediately
    setUserData(null);
    setToken(null);
    setOrgId(null);
    setUserType("INDIVIDUAL"); // Reset default template view state
    setNavState(null);

    // 2. Pure persistent storage hard clean
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("orgId");
    localStorage.removeItem("user_data");
    
    // Clear temporary volatile cache structures 
    sessionStorage.clear();

    // 3. Kick back to main authentication gateway screen
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

      // ── NEW: Chapter detail (lesson list inside a chapter) ──
      case VIEWS.CHAPTER_DETAIL:
        return (
          <ChapterDetailPage
            navigate={navigate}
            userData={userData}
            chapterId={navState?.chapterId}
          />
        );

      // ── All dashboard views (unchanged) ──────────────────────
      case VIEWS.DASHBOARD:
      case VIEWS.DETECTION:
      case VIEWS.LEARN:
      case VIEWS.PROGRESS:
      case VIEWS.SETTINGS:
      case VIEWS.MEMBERS:
      case VIEWS.ADD_USER:
      case VIEWS.ISSUES:
      case VIEWS.ANALYTICS:
      case VIEWS.LEADERBOARD:
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