import React from "react";
import "./WelcomePage.css";

const WelcomePage = ({ navigate, VIEWS, onSignIn, onSignUp }) => {
  return (
    <div className="landing-page-wrapper">
      
      {/* Navbar */}
      <div className="navbar">
          <div className="navbar-logo">
              <img src="/svLogo.png" alt="SignVision Logo" className="logo-img-nav" /> 
          </div>
          
          <ul className="navbar-links">
              <li onClick={() => navigate(VIEWS.LANDING)}>Home</li>
              <li>Services</li>
              <li>About Us</li>
              <li>Contact</li>
          </ul>
      </div>

      {/* Main Content */}
      <div className="hero-section">
        
        {/* Card using Global (.card-common) + Page Specific (.welcome-card) styles */}
        <div className="card-common welcome-card">
          
         

          {/* Content Text */}
          <p className="welcome-text">
            An intelligent platform designed to help organizations and individuals
              validate identity, and manage verification securely.
          </p>

          {/* BUTTON CONTAINER (Inner Glass Box) */}
          <div className="welcome-btn-box">
            
            {/* Sign Up Button */}
            <button 
                className="cta-button welcome-btn" 
                onClick={onSignUp} 
            >
                Sign Up
            </button>

            {/* Sign In Button (Outline Style) */}
            <button 
                className="cta-button welcome-btn btn-outline" 
                onClick={onSignIn} 
            >
                Sign In
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;