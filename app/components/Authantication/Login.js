"use client";
import { useState } from "react";
import "./Login.css";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";

export default function LoginPage() {
  const [isActive, setIsActive] = useState(false);
  const { login, register } = useContext(AuthContext);
  const {tokens} = useContext(AuthContext)

  const toggleToSignUp = (event) => {
    event.preventDefault();
    setIsActive(true);
  };

  const toggleToSignIn = (event) => {
    event.preventDefault();
    setIsActive(false);
  };

  // to handle sign in
  function handleSubmitSignIn(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    login({ username, password });

    console.log(username, password);
    console.log(tokens);
    
  }

  // to handle sign up
  function handleSubmitSignUp(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    register({ username, email, password });

    console.log(username, email, password);
  }

  return (
    <div className="form-parent">
          <div
      className={`auth-container container ${isActive ? "panel-active" : ""}`}
      id="auth-container"
    >
      <div className="form-section signup-section">
        <form onSubmit={handleSubmitSignUp}>
          <h1>Create Account</h1>

          <input type="text" placeholder="Name" name="username" />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="form-section signin-section">
        <form onSubmit={handleSubmitSignIn}>
          <h1>Sign In</h1>
          <input type="text" placeholder="Email" name="username" />
          <input type="password" placeholder="Password" name="password" />

          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle-section">
          <div className="toggle-panel panel-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site features</p>
            <button id="login" onClick={toggleToSignIn}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel panel-right">
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
    </div>
  );
}