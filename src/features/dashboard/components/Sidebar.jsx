import React from "react";

const Sidebar = ({
  navigate,
  currentView,
  isOpen,
  toggleSidebar,
  VIEWS,
  userType,
}) => {

  // ✅ Safety check
  if (!VIEWS) {
    console.error("Sidebar Error: VIEWS is undefined");
    return null;
  }

  // ✅ Normalize userType (CRITICAL FIX)
  const safeUserType = userType?.toUpperCase() || "INDIVIDUAL";

  console.log("Sidebar userType:", safeUserType);

  // ✅ Common items (for all users)
  const commonItems = [
    { label: "Dashboard", view: VIEWS.DASHBOARD },
    { label: "Settings", view: VIEWS.SETTINGS },
  ];

  // ✅ Individual user menu
  const individualItems = [
    { label: "Detection", view: VIEWS.DETECTION },
    { label: "Learn", view: VIEWS.LEARN },
    { label: "Progress", view: VIEWS.PROGRESS },
  ];

  // ✅ Organization menu (FIXED + Issues added)
  const orgItems = [
    { label: "Members", view: VIEWS.MEMBERS },
    { label: "Add User", view: VIEWS.ADD_USER },
    { label: "Analytics", view: VIEWS.ANALYTICS },
    { label: "Issues", view: VIEWS.ISSUES }, // ✅ Added
  ];

  // ✅ Dynamic menu based on role
  const menuItems = [
    ...commonItems,
    ...(safeUserType === "INDIVIDUAL" ? individualItems : []),
    ...(safeUserType === "ORGANIZATION" ? orgItems : []),
  ];

  // ✅ Logout handler (IMPORTANT FIX)
  const handleLogout = () => {
    // Clear stored auth/session data
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    localStorage.removeItem("orgId");

    // Optional: clear everything
    // localStorage.clear();

    navigate(VIEWS.SIGN_IN);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        
        <div className="sidebar-header">
          <h2 className="sidebar-title">SignVision</h2>
        </div>

        <ul className="sidebar-list">
          {menuItems.map((item) => (
            <li
              key={item.view}
              onClick={() => {
                navigate(item.view);
                if (isOpen) toggleSidebar();
              }}
              className={currentView === item.view ? "active" : ""}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;