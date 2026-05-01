import React from "react";
import { motion } from "framer-motion";
import "./WelcomePage.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

const WelcomePage = ({ navigate, VIEWS, onSignIn, onSignUp }) => {
  return (
    <div className="landing-page-wrapper">

      {/* Navbar */}
      <motion.div
        className="navbar"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="navbar-logo">
          <img src="/svLogo.png" alt="SignVision Logo" className="logo-img-nav" />
        </div>

        <ul className="navbar-links">
          <li onClick={() => navigate(VIEWS.LANDING)}>Home</li>
          <li>Services</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
      </motion.div>

      {/* Hero Section */}
      <div className="hero-section">
        
        <motion.div
          className="card-common welcome-card"
          variants={container}
          initial="hidden"
          animate="show"
        >

          {/* Title */}
          <motion.h1 variants={fadeUp}>
            Welcome to SignVision
          </motion.h1>

          {/* Description */}
          <motion.p className="welcome-text" variants={fadeUp}>
            An intelligent platform designed to help organizations and individuals
            validate identity, and manage verification securely.
          </motion.p>

          {/* Button Box */}
          <motion.div className="welcome-btn-box" variants={fadeIn}>

            <motion.button
              className="cta-button welcome-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignUp}
            >
              Sign Up
            </motion.button>

            <motion.button
              className="cta-button welcome-btn btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignIn}
            >
              Sign In
            </motion.button>

          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;