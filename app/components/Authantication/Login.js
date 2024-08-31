"use client";
import { useState } from "react";
import "./Login.css";

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);

  const toggleToSignUp = (event) => {
    event.preventDefault(); // Prevent form submission
    setIsActive(true); // Activate sign-up panel
  };

  const toggleToSignIn = (event) => {
    event.preventDefault(); // Prevent form submission
    setIsActive(false); // Activate sign-in panel
  };

  return (
    <div
      className={`container ${isActive ? "right-panel-active" : ""}`}
      id="container"
    >
      <div className="form-container sign-up">
        <form>
          <h1>Create Account</h1>
          
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" onClick={toggleToSignIn}>
            Sign Up
          </button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form>
          <h1>Sign In</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Forgot Your Password?</a>
          <button type="submit" onClick={toggleToSignUp}>
            Sign In
          </button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site features</p>
            <button id="login" onClick={toggleToSignIn}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>
              Register with your personal details to use all of the site
              features
            </p>
            <button id="register" onClick={toggleToSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
