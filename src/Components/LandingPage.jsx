import React from 'react';
/*import "./App.css"; */

export default function LandingPage({ onJoinClick }) { 
    return (
        <div className="landing-page-wrapper">
            <div className="navbar">
                <div className="navbar-logo">
                    {/* Updated to use svLogo.png */}
                    <img src="/svLogo.png" alt="SignVision Logo" className="logo-img-nav" /> 
                </div>
                <ul className="navbar-links">
                 
                    
                    <li>About Us</li>
                    <li>Contact</li>
                </ul>
            </div>

            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-text-area">
                        <h1>Welcome to SignVision</h1>
                        <p className="hero-description">A learning and communication platform designed to help organizations and individuals validate identity, and manage verification securely.</p>
                        
                        <button className="cta-button" onClick={onJoinClick}> 
                            START NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}