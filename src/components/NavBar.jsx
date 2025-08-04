import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBarStyles.css";
//This is from capstone 1

const NavBar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">EchoCache</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            {/* ✅ Show link if user is logged in */}
            {user.username && (
              <>
                <Link
                  to={`/profile/${user.id}`}
                  className={`profile-nav-btn nav-link${
                    location.pathname === `/profile/${user.id}` ? " active" : ""
                  }`}
                >
                  {`Welcome, ${user.username}!`}
                </Link>
                <button onClick={onLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
