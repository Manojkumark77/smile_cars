import React, { useState, useEffect } from "react";
import "./navbar.css";
import carlogo from "../../Images/smilcars-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import navLinks from "../../data/navbar.json";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ setShowLogin, setShowSignUp }) => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowProfile(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <img src={carlogo} alt="RentCars Logo" />
      </div>

      <nav className="navbar-links">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.path} className="link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="navbar-auth">
        {user ? (
          <div className="profile-section">
            <FaUserCircle
              className="profile-icon"
              size={28}
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
            {showProfile && (
              <div className="profile-dropdown">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="link" onClick={() => setShowLogin(true)}>
              Sign In
            </span>
            <button
              className="signup-button"
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
