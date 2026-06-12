import React from "react";
import Card from "../../dashboard/components/Card";

const ProgressPage = ({ navigate }) => {
  
  // Theme Palettes matching your dark blue/purple vision technology aesthetic
  const containerStyle = {
    color: "#e2e8f0", // Clean, readable off-white for text content
    fontFamily: "sans-serif",
    padding: "20px",
  };

  const subtitleStyle = {
    fontSize: "1.05rem",
    color: "#94a3b8", // Professional slate gray/blue text color
    marginTop: "5px",
    marginBottom: "30px",
  };

  const statsBoxStyle = {
    background: "linear-gradient(135deg, rgba(29, 29, 53, 0.8) 0%, rgba(21, 21, 38, 0.8) 100%)", // Rich dark-navy gradient
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(74, 103, 255, 0.25)", // Subtle dark blue glowing boundary
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 15px 35px rgba(10, 10, 26, 0.5)",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  };

  const scoreContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px"
  };

  const scoreTextStyle = {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#4a67ff", // Signature electric brand blue
    margin: 0,
    textShadow: "0 0 10px rgba(74, 103, 255, 0.3)"
  };

  const progressTrackStyle = {
    width: "100%",
    height: "10px",
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Deep slate track bed
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "5px",
    border: "1px solid rgba(255, 255, 255, 0.03)"
  };

  const progressFillStyle = {
    width: "78%", 
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6 0%, #4a67ff 100%)", // Vibrant blue progress split
    borderRadius: "10px",
    boxShadow: "0 0 14px rgba(74, 103, 255, 0.5)"
  };

  const badgeGridStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "12px"
  };

  const badgeItemStyle = (borderColor, textHighlight) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(30, 30, 58, 0.4)", // Dark blue tinted pill backing
    padding: "8px 16px",
    borderRadius: "20px",
    border: `1px solid ${borderColor}`,
    color: textHighlight || "#e2e8f0",
    fontSize: "0.85rem",
    fontWeight: "600",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
  });

  const chartContainerStyle = {
    background: "rgba(22, 22, 43, 0.6)", // Unified container backing
    border: "1px solid rgba(74, 103, 255, 0.15)",
    borderRadius: "16px",
    padding: "30px 25px 25px 25px",
    marginBottom: "35px",
    boxShadow: "0 15px 30px rgba(10, 10, 26, 0.4)"
  };

  const barWrapperStyle = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "160px",
    paddingTop: "20px",
    borderBottom: "2px solid rgba(74, 103, 255, 0.2)" // Crisp thematic grid line
  };

  const barStyle = (heightPercentage, isActive) => ({
    width: "10%",
    height: `${heightPercentage}%`,
    background: isActive 
      ? "linear-gradient(0deg, #4a67ff 0%, #60a5fa 100%)" // Highlight bar gradient
      : "linear-gradient(0deg, rgba(74, 103, 255, 0.15) 0%, rgba(74, 103, 255, 0.4) 100%)", // Standard thematic bars
    borderRadius: "4px 4px 0 0",
    boxShadow: isActive ? "0 0 15px rgba(74, 103, 255, 0.4)" : "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
  });

  const backLinkStyle = {
    display: "inline-flex",
    alignItems: "center",
    color: "#60a5fa", // Softer light-blue baseline
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    marginTop: "5px"
  };

  return (
    /* 🔥 FORCED OVERRIDE STYLE ADDED HERE: Changes the card container background color to match your dark web theme */
    <Card style={{ 
      backgroundColor: "#1a1a2f", 
      border: "1px solid rgba(255, 255, 255, 0.05)", 
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)" 
    }}>
      <div style={containerStyle}>
        
        {/* Header Section */}
        <h2 style={{ fontSize: "2.2rem", fontWeight: "800", margin: 0, color: "#ffffff", letterSpacing: "-0.5px" }}>
          Your Progress Report
        </h2>
        <p style={subtitleStyle}>
          Track your proficiency, points, and achievement badges.
        </p>

        {/* Progress Stats Box */}
        <div style={statsBoxStyle}>
          <div style={scoreContainerStyle}>
            <h3 style={scoreTextStyle}>Proficiency Score: 78%</h3>
            <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "#60a5fa" }}>
              ⚡ 1,450 Total Points
            </span>
          </div>
          
          {/* Visual Progress Slider Line */}
          <div style={progressTrackStyle}>
            <div style={progressFillStyle}></div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", letterSpacing: "1px" }}>EARNED BADGES</label>
            <div style={badgeGridStyle}>
              <div style={badgeItemStyle("rgba(205, 127, 50, 0.3)", "#ffdca8")}>🥉 Beginner</div>
              <div style={badgeItemStyle("rgba(255, 215, 0, 0.3)", "#fff3ad")}>⭐ Alphabet Master</div>
              <div style={badgeItemStyle("rgba(74, 103, 255, 0.4)", "#adc1ff")}>🔥 7-Day Streak</div>
            </div>
          </div>
        </div>

        {/* Chart Visualization Container */}
        <div style={chartContainerStyle}>
          <h4 style={{ margin: "0 0 25px 0", fontSize: "0.8rem", color: "#64748b", fontWeight: "700", letterSpacing: "1px" }}>
            WEEKLY ACTIVITY HISTORY
          </h4>
          
          <div style={barWrapperStyle}>
            <div style={barStyle(35, false)} title="Mon: 35%"></div>
            <div style={barStyle(45, false)} title="Tue: 45%"></div>
            <div style={barStyle(60, false)} title="Wed: 60%"></div>
            <div style={barStyle(55, false)} title="Thu: 55%"></div>
            <div style={barStyle(70, false)} title="Fri: 70%"></div>
            <div style={barStyle(85, false)} title="Sat: 85%"></div>
            <div style={barStyle(95, true)} title="Sun: 95% (Peak)"></div>
          </div>
          
          {/* Chart Timeline Labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", color: "#475569", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.5px" }}>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>
        </div>

        {/* Navigation Action Hook */}
        <span 
          style={backLinkStyle} 
          onClick={() => navigate("DASHBOARD")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-4px)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
            e.currentTarget.style.color = "#60a5fa";
          }}
        >
          Back to Dashboard
        </span>

      </div>
    </Card>
  );
};

export default ProgressPage;