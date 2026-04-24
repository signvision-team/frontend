import React from "react";

const Sidebar = ({ navigate, currentView, isOpen, toggleSidebar }) => {
  const menuItems = [
    { label: "Dashboard", view: "DASHBOARD" },
    { label: "Detection", view: "DETECTION" },
    { label: "Learn", view: "LEARN" },
    { label: "Progress", view: "PROGRESS" },
    { label: "Settings", view: "SETTINGS" },
  ];

  return (
    <>
      {/* Overlay for mobile (closes sidebar when clicking outside) */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        
        {/* Header - Removed close button for cleaner look */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">SignVision</h2>
        </div>

        {/* Menu */}
        <ul className="sidebar-list">
          {menuItems.map((item) => (
            <li
              key={item.view}
              onClick={() => {
                navigate(item.view);
                // Close sidebar on item click (important for mobile UX)
                if (isOpen) {
                  toggleSidebar(); 
                }
              }}
              className={currentView === item.view ? "active" : ""}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* Logout fixed at bottom via CSS (.sidebar-footer) */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout"
            onClick={() => navigate("MAIN_MENU")}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;