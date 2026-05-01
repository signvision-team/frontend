import React from "react";

export default function LandingPage({ onJoinClick }) {
  return (
    <div className="landing-page-wrapper">

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img
            src="/svLogo.png"
            alt="SignVision Logo"
            className="logo-img-nav"
          />
        </div>

        <ul className="navbar-links">
          <li>
            <button type="button" className="nav-link-btn">
              About Us
            </button>
          </li>

          <li>
            <button type="button" className="nav-link-btn">
              Contact
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">

          <div className="hero-text-area">
            <h1>Welcome to SignVision</h1>

            <p className="hero-description">
              A learning and communication platform designed to help
              organizations and individuals validate identity, and manage
              verification securely.
            </p>

            <button className="cta-button" onClick={onJoinClick}>
              START NOW
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}