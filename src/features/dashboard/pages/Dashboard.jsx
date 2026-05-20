import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardIndividual from "./DashboardIndividual";
import DashboardOrganization from "./DashboardOrganization";

// Organization Components
import { UsersManagement } from "../features/UsersManagement";
import { AddUserForm } from "../../users/pages/AddUserForm";
import { IssuesPanel } from "../../issues/pages/IssuesPanel";

// Individual Components
import DetectionPage from "../../detection/pages/DetectionPage";
import ProgressPage from "./ProgressPage";
import LearnPage from "../../learning/pages/LearnPage";

// Images
import signDetectionIcon from "../../../assets/sign_detection_icon.png";
import gamifiedLearningIcon from "../../../assets/gamified_learning_icon.png";
import progressReportIcon from "../../../assets/progress_report_icon.png";
import settingsIcon from "../../../assets/settings_icon.png";
import profileIcon from "../../../assets/profile.png";

const VIEWS = {
  DASHBOARD: "DASHBOARD",
  DETECTION: "DETECTION",
  LEARN: "LEARN",
  PROGRESS: "PROGRESS",
  SETTINGS: "SETTINGS",

  MEMBERS: "MEMBERS",
  ADD_USER: "ADD_USER",
  ANALYTICS: "ANALYTICS",
  ISSUES: "ISSUES",

  SIGN_IN: "SIGN_IN",
};

const Dashboard = ({ navigate, currentView, userType, userData, orgId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 🔥 FIX 1: force correct userType from storage fallback
  const storedUserType = localStorage.getItem("userType");
  const finalUserType = userType || storedUserType || "INDIVIDUAL";

  // 🔥 FIX 2: normalize orgId from multiple sources
  const storedOrgId = localStorage.getItem("orgId");
  const finalOrgId = orgId || storedOrgId || null;

  const isOrg = finalUserType === "ORGANIZATION";

  useEffect(() => {
    console.log("USER TYPE:", finalUserType);
    console.log("ORG ID:", finalOrgId);
  }, [finalUserType, finalOrgId]);

  const featureCards = [
    {
      title: "Real-time Sign Detection",
      description: "Practice your sign language skills with live feedback.",
      imageSrc: signDetectionIcon,
      onClick: () => navigate(VIEWS.DETECTION),
      newBadge: true,
    },
    {
      title: "Gamified Learning",
      description: "Engaging levels and quizzes to boost your skills.",
      imageSrc: gamifiedLearningIcon,
      onClick: () => navigate(VIEWS.LEARN),
    },
    {
      title: "Progress Report",
      description: "Track your learning journey.",
      imageSrc: progressReportIcon,
      onClick: () => navigate(VIEWS.PROGRESS),
    },
    {
      title: "Settings",
      description: "Customize your app experience.",
      imageSrc: settingsIcon,
      onClick: () => navigate(VIEWS.SETTINGS),
    },
  ];

  const renderDashboardContent = () => {
    if (isOrg) {
      if (currentView === VIEWS.MEMBERS)
        return <UsersManagement orgId={finalOrgId} />;

      if (currentView === VIEWS.ADD_USER)
        return <AddUserForm orgId={finalOrgId} />;

      if (currentView === VIEWS.ISSUES)
        return <IssuesPanel orgId={finalOrgId} />;

      if (currentView === VIEWS.ANALYTICS) {
        return (
          <div style={{ color: "white", padding: "20px" }}>
            Analytics Coming Soon (Org: {finalOrgId})
          </div>
        );
      }
    }

    if (currentView === VIEWS.DETECTION)
      return <DetectionPage navigate={navigate} />;

    if (currentView === VIEWS.PROGRESS)
      return <ProgressPage navigate={navigate} />;

    if (currentView === VIEWS.LEARN)
      <LearnPage
   navigate={navigate}
   userData={userData}
/>

    if (currentView === VIEWS.SETTINGS)
      return (
        <div style={{ color: "white", padding: "20px" }}>
          Settings Coming Soon
        </div>
      );

    if (currentView === VIEWS.DASHBOARD) {
      return isOrg ? (
        <DashboardOrganization
          navigate={navigate}
          orgId={finalOrgId}
          userData={userData}
        />
      ) : (
        <DashboardIndividual
          navigate={navigate}
          userData={userData}
        />
      );
    }

    return null;
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        navigate={navigate}
        currentView={currentView}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        VIEWS={VIEWS}
        userType={finalUserType}
      />

      <div className="page-container content-with-sidebar">
        <div className="dashboard-header">
          <button className="menu-btn" onClick={toggleSidebar}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>

          <h2 className="page-title">
            {isOrg
              ? `Organization Dashboard ${finalOrgId ? `(${finalOrgId})` : ""}`
              : "My Dashboard"}
          </h2>

          <div className="user-profile">
            <img src={profileIcon} alt="User" />
          </div>
        </div>

        {currentView === VIEWS.DASHBOARD && !isOrg && (
          <div className="feature-blocks-container">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="feature-block-card"
                onClick={card.onClick}
              >
                <div className="feature-content">
                  {card.newBadge && <span className="new-badge">New</span>}
                  <h3 className="feature-title">{card.title}</h3>
                  <p className="feature-description">{card.description}</p>
                </div>

                <div className="feature-image-container">
                  <img src={card.imageSrc} alt={card.title} />
                </div>
              </div>
            ))}
          </div>
        )}

        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;