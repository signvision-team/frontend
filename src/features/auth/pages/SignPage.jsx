// src/features/auth/pages/SignPage.jsx
import React, { useState, useEffect, useRef } from "react";

const SignPage = ({ navigate, VIEWS, setUserType, handleLogin }) => {
  const [loginType, setLoginType] = useState("INDIVIDUAL");
  const [errorMessage, setErrorMessage] = useState(""); // Managed state error view panel
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    orgId: ""
  });

  const footerRef = useRef(null);

  const handleChange = (e) => {
    setErrorMessage(""); // Instantly clear error when user types again
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Safe flush states whenever the user switches roles
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      orgId: ""
    });
    setErrorMessage("");
  }, [loginType]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const emailClean = formData.email.trim();
    const passwordClean = formData.password.trim();
    const orgIdClean = formData.orgId.trim();

    // 1. Validation checks on Client View before firing network traffic
    if (!emailClean || !passwordClean) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    // 2. ENFORCE VALIDATION: Ensure Org ID is provided if logging in as an organization
    if (loginType === "ORGANIZATION" && !orgIdClean) {
      setErrorMessage("Please provide your unique Organization ID to access your workspace.");
      return;
    }

    const payload = {
      email: emailClean,
      password: passwordClean,
      userType: loginType,
      orgID: loginType === "ORGANIZATION" ? orgIdClean : null
    };

    try {
      setIsSubmitting(true);
      const result = await handleLogin(payload);

      // Successfully authenticated profile matching wrapper constraints
      if (result && result.success) {
        const backendUserType = result.user?.userType;
        const finalUserType = backendUserType || loginType;

        if (setUserType) setUserType(finalUserType);

        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        localStorage.setItem("userType", finalUserType);

        const orgIdValue =
          result.user?.orgID ||
          result.user?.orgId ||
          result.user?.organizationId ||
          (loginType === "ORGANIZATION" ? orgIdClean : null);

        if (orgIdValue) {
          localStorage.setItem("orgId", orgIdValue);
        }

        navigate(VIEWS.DASHBOARD);
      } else {
        // Capture direct errors from our updated API stream
        setErrorMessage(result?.message || "Login failed. Invalid account metadata.");
      }
    } catch (err) {
      console.error("Login component execution crash:", err);
      setErrorMessage("Could not connect to the authentication node. Check your backend status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    backgroundColor:
      "rgba(30, 30, 47, 0.8)",
    color: "#ffffff",
    border:
      "1px solid rgba(74, 103, 255, 0.5)",
    borderRadius: "8px",
    padding: "12px",
    width: "100%",
    marginTop: "8px",
    outline: "none"
  };

  const getToggleStyle = (type) => ({
    flex: 1,
    padding: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "8px",
    backgroundColor:
      loginType === type
        ? "#4a67ff"
        : "rgba(255, 255, 255, 0.05)",
    color:
      loginType === type
        ? "#fff"
        : "#888",
    transition: "all 0.3s ease"
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#121123",
        minHeight: "100vh"
      }}
    >

      {/* HERO SECTION */}
      <div
        className="sign-in-page-wrapper"
        style={{
          minHeight: "calc(100vh - 250px)",
          backgroundImage:
            "url('/homepage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding:
            "80px 40px 40px 40px",
          position: "relative"
        }}
      >

        {/* HEADER */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "40px",
            right: "40px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            zIndex: 10
          }}
        >

          {/* LOGO */}
          <div>
            <img
              src="/svLogo.png"
              alt="SignVision"
              style={{ height: "150px" }}
            />
          </div>

          {/* RIGHT NAVBAR */}
          <div
            style={{
              marginLeft: "auto"
            }}
          >
            <ul
              style={{
                display: "flex",
                gap: "30px",
                listStyle: "none",
                margin: 0,
                padding: 0
              }}
            >
            

              {/* ABOUT US */}
              <li
                onClick={() => {
                  const footer =
                    document.getElementById(
                      "footer"
                    );

                  if (footer) {
                    footer.scrollIntoView({
                      behavior: "smooth"
                    });
                  }
                }}
                style={{
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "1.05rem"
                }}
              >
                About Us
              </li>
            </ul>
          </div>
        </div>

        {/* LEFT CONTENT */}
        <div
          style={{
            flex: "1",
            maxWidth: "500px",
            color: "#fff",
            zIndex: 2
          }}
        >
          <h1
            style={{
              fontSize: "4.5rem",
              fontWeight: "800",
              margin: 0,
              lineHeight: "1.1"
            }}
          >
            SignVision
          </h1>

          <p
            style={{
              fontSize: "1.111rem",
              color:
                "rgba(255, 255, 255, 0.7)",
              marginTop: "20px",
              lineHeight: "1.6"
            }}
          >
            Empowering communication
            through innovative vision
            technology. Sign in to
            access your personalized
            dashboard and bridge the
            gap.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div
          style={{
            flex: "0 1 420px",
            backgroundColor:
              "rgba(29, 29, 53, 0.95)",
            backdropFilter:
              "blur(10px)",
            padding: "40px",
            borderRadius: "20px",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.5)",
            border:
              "1px solid rgba(255,255,255,0.1)",
            zIndex: 2
          }}
        >
          {/* TOGGLE */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "30px",
              background:
                "rgba(0,0,0,0.2)",
              padding: "5px",
              borderRadius: "10px"
            }}
          >
            <button
              type="button"
              style={getToggleStyle(
                "INDIVIDUAL"
              )}
              onClick={() =>
                setLoginType(
                  "INDIVIDUAL"
                )
              }
            >
              Individual
            </button>

            <button
              type="button"
              style={getToggleStyle(
                "ORGANIZATION"
              )}
              onClick={() =>
                setLoginType(
                  "ORGANIZATION"
                )
              }
            >
              Organization
            </button>
          </div>

          <h2
            style={{
              color: "#fff",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "1.8rem"
            }}
          >
            Welcome Back
          </h2>

          <form onSubmit={onSubmit}>
            {loginType ===
              "ORGANIZATION" && (
              <div
                style={{
                  marginBottom: "20px"
                }}
              >
                <label
                  style={{
                    color: "#aaa",
                    fontSize:
                      "0.85rem"
                  }}
                >
                  Organization ID
                </label>

                <input
                  type="text"
                  name="orgId"
                  value={
                    formData.orgId
                  }
                  onChange={
                    handleChange
                  }
                  style={inputStyle}
                  required
                />
              </div>
            )}

            <div
              style={{
                marginBottom: "20px"
              }}
            >
              <label
                style={{
                  color: "#aaa",
                  fontSize:
                    "0.85rem"
                }}
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={
                  handleChange
                }
                style={inputStyle}
                required
              />
            </div>

            <div
              style={{
                marginBottom: "25px"
              }}
            >
              <label
                style={{
                  color: "#aaa",
                  fontSize:
                    "0.85rem"
                }}
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor:
                  "#4a67ff",
                color: "#fff",
                padding: "14px",
                borderRadius: "10px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                boxShadow:
                  "0 4px 15px rgba(74, 103, 255, 0.3)"
              }}
            >
              Sign In
            </button>
          </form>

          {/* CREATE ACCOUNT */}
          <div
            style={{
              marginTop: "30px",
              textAlign: "center"
            }}
          >
            <p
              style={{
                color:
                  "rgba(255,255,255,0.5)",
                fontSize: "0.9rem"
              }}
            >
              Don't have an account?{" "}
              <span
                style={{
                  color: "#4a67ff",
                  cursor: "pointer",
                  fontWeight:
                    "bold"
                }}
                onClick={() => {
                  if (
                    loginType ===
                    "ORGANIZATION"
                  ) {
                    navigate(
                      VIEWS.SIGN_UP_TYPE,
                      {
                        state: {
                          defaultType:
                            "ORGANIZATION"
                        }
                      }
                    );
                  } else {
                    navigate(
                      VIEWS.SIGN_UP_TYPE,
                      {
                        state: {
                          defaultType:
                            "INDIVIDUAL"
                        }
                      }
                    );
                  }
                }}
              >
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
{/* FOOTER */}
<footer
  id="footer"
  ref={footerRef}
  style={{
    background:
      "linear-gradient(180deg, #17172d 0%, #111122 55%, #0b0b16 100%)",
    borderTop:
      "1px solid rgba(74,103,255,0.25)",
    color: "#ffffff",
    padding: "85px 60px 35px 60px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "sans-serif"
  }}
>

  {/* GLOW EFFECTS */}
  <div
    style={{
      position: "absolute",
      width: "350px",
      height: "350px",
      background:
        "rgba(74,103,255,0.12)",
      borderRadius: "50%",
      filter: "blur(120px)",
      top: "-120px",
      right: "-100px"
    }}
  />

  <div
    style={{
      position: "absolute",
      width: "250px",
      height: "250px",
      background:
        "rgba(95, 125, 255, 0.08)",
      borderRadius: "50%",
      filter: "blur(100px)",
      bottom: "-100px",
      left: "-80px"
    }}
  />

  {/* MAIN FOOTER CONTENT */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "70px",
      maxWidth: "1350px",
      margin: "0 auto",
      position: "relative",
      zIndex: 2
    }}
  >

    {/* BRAND SECTION */}
    <div
      style={{
        flex: "1 1 420px"
      }}
    >
      <h2
        style={{
          fontSize: "2.3rem",
          marginBottom: "18px",
          fontWeight: "800",
          background:
            "linear-gradient(to right, #ffffff, #7d93ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.5px"
        }}
      >
        SignVision AI
      </h2>

      <p
        style={{
          color: "#b8b8c7",
          fontSize: "1rem",
          lineHeight: "2",
          maxWidth: "550px"
        }}
      >
        SignVision is an advanced AI-powered accessibility
        platform designed to bridge communication barriers
        between spoken and sign language communities.
        Through real-time computer vision, intelligent
        gesture recognition, and deep learning pipelines,
        the system transforms sign gestures into seamless
        digital interaction experiences.
      </p>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          gap: "35px",
          marginTop: "35px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <h3
            style={{
              color: "#4a67ff",
              fontSize: "1.8rem",
              margin: 0
            }}
          >
            AI
          </h3>

          <p
            style={{
              marginTop: "6px",
              color: "#999"
            }}
          >
            Powered Recognition
          </p>
        </div>

        <div>
          <h3
            style={{
              color: "#4a67ff",
              fontSize: "1.8rem",
              margin: 0
            }}
          >
            CV
          </h3>

          <p
            style={{
              marginTop: "6px",
              color: "#999"
            }}
          >
            Computer Vision Engine
          </p>
        </div>

        <div>
          <h3
            style={{
              color: "#4a67ff",
              fontSize: "1.8rem",
              margin: 0
            }}
          >
            RT
          </h3>

          <p
            style={{
              marginTop: "6px",
              color: "#999"
            }}
          >
            Real-Time Processing
          </p>
        </div>
      </div>
    </div>

    {/* FEATURES */}
    <div
      style={{
        flex: "1 1 250px"
      }}
    >
      <h3
        style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          marginBottom: "22px",
          fontWeight: "700",
          letterSpacing: "1px"
        }}
      >
        CORE FEATURES
      </h3>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          color: "#c7c7d1",
          lineHeight: "2.5",
          fontSize: "0.95rem"
        }}
      >
        <li>
          • Real-Time Hand Tracking
        </li>

        <li>
          • AI Sign Language Translation
        </li>

        <li>
          • Gesture-to-Speech Conversion
        </li>

        <li>
          • Interactive Quiz System
        </li>

        <li>
          • Smart Organization Dashboard
        </li>

        <li>
          • Deep Learning Integration
        </li>

        <li>
          • Accessibility-Centered Design
        </li>
      </ul>
    </div>

    {/* TECHNOLOGY */}
    <div
      style={{
        flex: "1 1 220px"
      }}
    >
      <h3
        style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          marginBottom: "22px",
          fontWeight: "700",
          letterSpacing: "1px"
        }}
      >
        TECHNOLOGY STACK
      </h3>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          color: "#c7c7d1",
          lineHeight: "2.5",
          fontSize: "0.95rem"
        }}
      >
        <li>• React.js Frontend</li>
        <li>• Node.js Backend</li>
        <li>• TensorFlow / AI Models</li>
        <li>• OpenCV Processing</li>
        <li>• MongoDB Database</li>
        <li>• Real-Time Detection APIs</li>
      </ul>
    </div>

    {/* QUICK NAVIGATION */}
    <div
      style={{
        flex: "1 1 220px"
      }}
    >
      <h3
        style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          marginBottom: "22px",
          fontWeight: "700",
          letterSpacing: "1px"
        }}
      >
        QUICK LINKS
      </h3>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          color: "#c7c7d1",
          lineHeight: "2.5",
          fontSize: "0.95rem"
        }}
      >
        <li
          style={{
            cursor: "pointer",
            color: "#4a67ff",
            fontWeight: "600",
            transition: "0.3s"
          }}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            })
          }
        >
          Back to Top ↑
        </li>

        <li>
          Accessibility Standards
        </li>

        <li>
          AI Research Documentation
        </li>

        <li>
          Organization Support
        </li>

        <li>
          Computer Vision APIs
        </li>

        <li>
          Developer Contact
        </li>
      </ul>
    </div>
  </div>

  {/* LOWER BAR */}
  <div
    style={{
      borderTop:
        "1px solid rgba(255,255,255,0.08)",
      marginTop: "70px",
      paddingTop: "25px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      position: "relative",
      zIndex: 2
    }}
  >

    {/* COPYRIGHT */}
    <div
      style={{
        color: "#7d7d92",
        fontSize: "0.9rem",
        letterSpacing: "0.3px"
      }}
    >
      © {new Date().getFullYear()} SignVision AI Systems.
      All rights reserved.
    </div>

    {/* STATUS */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#8f8fa8",
        fontSize: "0.9rem"
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#4a67ff",
          boxShadow:
            "0 0 12px #4a67ff"
        }}
      />

      Intelligent Accessibility Platform Online
    </div>
  </div>
</footer>
    </div>
  );
};

export default SignPage;