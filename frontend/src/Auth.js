import { useState } from "react";
import "./Auth.css"; // Import the CSS file
import Logo from "../src/assets/jobtracker-logo.jpg"; // Ensure the correct path
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, getAuth } from 'firebase/auth';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // ✅ Handle Signup & Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
          localStorage.setItem("token", user.accessToken);
          onAuthSuccess();
        } else {
          alert("Please verify your email address.");
        }
      } catch (error) {
        alert("Invalid email or password.");
      }
    } else {
      // Sign Up
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);

        alert("Please verify your email. A verification link has been sent.");
        setIsVerifying(true); // Move to verification step
      } catch (error) {
        alert("Error signing up: " + error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">
        <span>J</span><span>o</span><span>b</span> <span>T</span><span>r</span><span>a</span><span>c</span><span>k</span><span>e</span><span>r</span>
      </h1>
      <img src={Logo} alt="Job Tracker Logo" className="auth-logo" />

      {/* ✅ Verification Step */}
      {isVerifying ? (
        <>
          <h2>Check your email for the verification link</h2>
          <p>Once you verify your email, you can log in.</p>
        </>
      ) : (
        <>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />

            <div className="auth-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="auth-button">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        </>
      )}

      <p onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
        {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default Auth;