import React, { useState } from "react";
import Sidebar from "../components/Sidebar ";

const DashboardLayout = ({
  currentView,
  navigate,
  userType,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-wrapper">

      {/* SIDEBAR */}
      <Sidebar
        navigate={navigate}
        currentView={currentView}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* MAIN CONTENT AREA */}
      <div className={`page-container ${isSidebarOpen ? "sidebar-open" : ""}`}>

        {/* TOP HEADER */}
        <div className="dashboard-header">

          {/* Hamburger Menu */}
          <button className="menu-btn" onClick={toggleSidebar}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>

          {/* Title */}
          <h2 className="page-title">
            {userType === "ORGANIZATION"
              ? "Organization Dashboard"
              : "My Dashboard"}
          </h2>

          {/* Profile */}
          <div className="user-profile">
            <img src="/profile.png" alt="User" />
          </div>

        </div>

        {/* PAGE CONTENT (DYNAMIC) */}
        <div className="dashboard-body">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;