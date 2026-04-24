import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardIndividual from "./DashboardIndividual";
import DashboardOrganization from "./DashboardOrganization";

//  Import New Organization Components
import { UsersManagement } from "./UsersManagement"; 
import { AddUserForm } from "./AddUserForm"; 
import { IssuesPanel } from "./IssuesPanel"; 
import { ProgressDashboard } from "./ProgressDashboard"; 

// Import Individual Components
import DetectionPage from "./DetectionPage"; 
import ProgressPage from "./ProgressPage";   

const Dashboard = ({ navigate, currentView, userType, setUserType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Feature Cards Data (Displayed only on the main Dashboard screen)
  const featureCards = [
    { 
      title: "Real-time Sign Detection", 
      description: "Practice your sign language skills with live feedback.", 
      imageSrc: "/sign_detection_icon.png", 
      onClick: () => navigate("DETECTION"),
      newBadge: true 
    },
    { 
      title: "Gamified Learning", 
      description: "Engaging levels and quizzes to boost your sign language proficiency.", 
      imageSrc: "/gamified_learning_icon.png",
      onClick: () => navigate("LEARN"),
      newBadge: false 
    },
    { 
      title: "Progress Report", 
      description: "Track your learning journey and identify areas for improvement.", 
      imageSrc: "/progress_report_icon.png",
      onClick: () => navigate("PROGRESS"),
      newBadge: false 
    },
    { 
      title: "Settings", 
      description: "Customize your app experience and manage your account.", 
      imageSrc: "/settings_icon.png",
      onClick: () => navigate("SETTINGS"),
      newBadge: false 
    },
  ];

  // Helper to determine what content to render inside the dashboard layout
  const renderDashboardContent = () => {
    // --- ORGANIZATION VIEWS ---
    if (currentView === "MEMBERS") return <UsersManagement />;
    if (currentView === "ADD_USER") return <AddUserForm />;
    if (currentView === "ISSUES") return <IssuesPanel />;
    if (currentView === "ANALYTICS") return <ProgressDashboard />;

    // --- INDIVIDUAL VIEWS ---
    if (currentView === "DETECTION") return <DetectionPage navigate={navigate} />;
    if (currentView === "PROGRESS") return <ProgressPage navigate={navigate} />;
    if (currentView === "LEARN") return <div style={{color:'white', padding:'20px'}}>Learning Module Coming Soon</div>;
    if (currentView === "SETTINGS") return <div style={{color:'white', padding:'20px'}}>Settings Component Coming Soon</div>;
    if (currentView === "LEARN") return <LearnPage navigate={navigate} />;
    // --- MAIN DASHBOARD HOME ---
    if (currentView === "DASHBOARD") {
        return userType === "ORGANIZATION" 
            ? <DashboardOrganization navigate={navigate} /> 
            : <DashboardIndividual navigate={navigate} />;
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
      />

      <div className="page-container content-with-sidebar">

        {/* Header */}
        <div className="dashboard-header">
          <button className="menu-btn" onClick={toggleSidebar}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>

          <h2 className="page-title">
            {userType === "ORGANIZATION" ? "Organization Dashboard" : "My Dashboard"}
          </h2>

          {/* User Profile */}
          <div className="user-profile">
            <img src="/profile.png" alt="User" />
          </div>
        </div>

        {/* Show Feature Cards ONLY on the main dashboard view */}
        {currentView === "DASHBOARD" && (
            <div className="feature-blocks-container">
            {featureCards.map((card, index) => (
                <div key={index} className="feature-block-card" onClick={card.onClick}>
                <div className="feature-content">
                    {card.newBadge && <span className="new-badge">New</span>}
                    <h3 className="feature-title">{card.title}</h3>
                    <p className="feature-description">{card.description}</p>
                </div>
                <div className="feature-image-container">
                    <img src={card.imageSrc} alt={card.title} className="feature-image" />
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Render the specific page content */}
        {renderDashboardContent()}

      </div>
    </div>
  );
};

export default Dashboard;